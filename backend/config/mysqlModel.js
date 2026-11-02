const { pool } = require("./db");
const MODEL_REGISTRY = {};
const REF_MODELS = { studentId: "Student", mealId: "Meal", vendorId: "Vendor" };
const snake = (s) => s.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
function cleanRow(row) { if (!row) return row; const out = { ...row, _id: String(row.id) }; return out; }
function normalizeValue(v) { if (v && typeof v === "object" && v._id) return v._id; return v; }
function buildWhere(filter = {}, table) {
  const clauses = [], values = [];
  for (const [key, value] of Object.entries(filter || {})) {
    if (key === "$or" && Array.isArray(value)) {
      const sub = value.map(f => { const x = buildWhere(f, table); values.push(...x.values); return `(${x.sql || "1=1"})`; });
      clauses.push(`(${sub.join(" OR ")})`); continue;
    }
    if (key === "$and" && Array.isArray(value)) {
      const sub = value.map(f => { const x = buildWhere(f, table); values.push(...x.values); return `(${x.sql || "1=1"})`; });
      clauses.push(`(${sub.join(" AND ")})`); continue;
    }
    const col = key === "_id" ? "id" : key;
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(col)) throw new Error("Unsupported query field: " + col);
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      if ("$in" in value) { if (!value.$in.length) clauses.push("1=0"); else { clauses.push(`\`${col}\` IN (${value.$in.map(()=>"?").join(",")})`); values.push(...value.$in.map(normalizeValue)); } }
      else if ("$ne" in value) { clauses.push(`\`${col}\` <> ?`); values.push(normalizeValue(value.$ne)); }
      else if ("$gte" in value || "$gt" in value || "$lte" in value || "$lt" in value) { for (const [op,sqlop] of [["$gte",">="],["$gt",">"],["$lte","<="],["$lt","<"]]) if (op in value) { clauses.push(`\`${col}\` ${sqlop} ?`); values.push(normalizeValue(value[op])); } }
      else throw new Error("Unsupported query operator for " + col);
    } else { clauses.push(`\`${col}\` ${value === null ? "IS NULL" : "= ?"}`); if (value !== null) values.push(normalizeValue(value)); }
  }
  return { sql: clauses.join(" AND "), values };
}
class Query {
  constructor(model, kind, filter, projection) { this.model=model; this.kind=kind; this.filter=filter||{}; this.projection=projection; this.sortSpec=null; this.populates=[]; }
  sort(spec) { this.sortSpec=spec; return this; }
  populate(field, select) { this.populates.push({field,select}); return this; }
  select(spec) { this.projection=spec; return this; }
  async exec() {
    const meta=this.model.meta, where=buildWhere(this.filter,meta.table); let sql=`SELECT * FROM \`${meta.table}\``;
    if (where.sql) sql += ` WHERE ${where.sql}`;
    if (this.sortSpec) { const terms=[]; for (const [k,v] of Object.entries(this.sortSpec)) { const col=k==="_id"?"id":k; if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(col)) continue; terms.push(`\`${col}\` ${Number(v)<0?"DESC":"ASC"}`); } if(terms.length) sql += " ORDER BY "+terms.join(", "); }
    if (this.kind === "one" || this.kind === "id") sql += " LIMIT 1";
    const [rows]=await pool.execute(sql,where.values); let result=rows.map(row => new this.model(row));
    if(this.kind==="one"||this.kind==="id") result=result[0]||null;
    if(this.projection) result=applyProjection(result,this.projection);
    if(this.populates.length) result=await populateResult(result,this.populates);
    return result;
  }
  then(resolve,reject) { return this.exec().then(resolve,reject); }
  catch(reject) { return this.exec().catch(reject); }
}
function applyProjection(data, spec) {
 const arr=Array.isArray(data)?data:[data]; if(!arr[0]) return data;
 const parts=String(spec).trim().split(/\s+/); const include=parts.filter(x=>!x.startsWith("-")).map(x=>x.replace(/^\+/,"")); const exclude=parts.filter(x=>x.startsWith("-")).map(x=>x.slice(1));
 const mapped=arr.map(row=>{ let o=row; if(include.length && !parts.some(x=>x.startsWith("-"))) { o={_id:row._id}; for(const k of include) if(k in row)o[k]=row[k]; } else { o={...row}; for(const k of exclude) delete o[k]; } return o; }); return Array.isArray(data)?mapped:mapped[0];
}
async function populateResult(data, populates) {
 const many=Array.isArray(data), rows=many?data:(data?[data]:[]);
 for(const row of rows) for(const p of populates) {
  const target=REF_MODELS[p.field]; if(!target || !row[p.field]) continue; const model=MODEL_REGISTRY[target]; if(!model) continue;
  const found=await model.findById(row[p.field]).exec(); if(!found) {row[p.field]=null;continue;}
  if(p.select) row[p.field]=applyProjection(found,p.select); else row[p.field]=found;
 }
 return many?rows:(rows[0]||null);
}
function defineModel(name, table, columns, defaults={}) {
 const meta={name,table,columns,defaults};
 class Model {
  constructor(data={}) { Object.assign(this,defaults); Object.assign(this,data); if (this.id !== undefined && this._id === undefined) this._id=String(this.id); if (this._id !== undefined && this.id === undefined) this.id=Number(this._id); this._isNew=!this.id&&!this._id; }
  async save() {
   const values={}; for(const k of columns) if(this[k]!==undefined) values[k]=normalizeValue(this[k]);
   if(this.id||this._id) { const id=this.id||this._id; const keys=Object.keys(values); if(keys.length){await pool.execute(`UPDATE \`${table}\` SET ${keys.map(k=>`\`${k}\` = ?`).join(", ")} WHERE id = ?`,[...keys.map(k=>values[k]),id]);} this.id=Number(id); this._id=String(id); }
   else { const keys=Object.keys(values); const [r]=await pool.execute(`INSERT INTO \`${table}\` (${keys.map(k=>`\`${k}\``).join(",")}) VALUES (${keys.map(()=>"?").join(",")})`,keys.map(k=>values[k])); this.id=r.insertId; this._id=String(r.insertId); }
   this._isNew=false; return this;
  }
  toObject(){const o={...this};delete o._isNew;return o;}
  static find(filter={},projection){return new Query(this,"many",filter,projection);}
  static findOne(filter={},projection){return new Query(this,"one",filter,projection);}
  static findById(id){return new Query(this,"id",{_id:id});}
  static async create(data){const item=new this(data);return item.save();}
  static async countDocuments(filter={}){const w=buildWhere(filter,table);const [r]=await pool.execute(`SELECT COUNT(*) AS count FROM \`${table}\`${w.sql?" WHERE "+w.sql:""}`,w.values);return Number(r[0].count);}
  static async findByIdAndDelete(id){const old=await this.findById(id);if(old)await pool.execute(`DELETE FROM \`${table}\` WHERE id = ?`,[id]);return old;}
  static async findByIdAndUpdate(id,update={},options={}){const old=await this.findById(id);if(!old)return null;const changes={...update};if(changes.$inc){for(const [k,v] of Object.entries(changes.$inc)){await pool.execute(`UPDATE \`${table}\` SET \`${k}\` = COALESCE(\`${k}\`,0) + ? WHERE id = ?`,[v,id]);}delete changes.$inc;}const keys=Object.keys(changes);if(keys.length)await pool.execute(`UPDATE \`${table}\` SET ${keys.map(k=>`\`${k}\` = ?`).join(",")} WHERE id = ?`,[...keys.map(k=>normalizeValue(changes[k])),id]);return options.new?this.findById(id):old;}
  static async findOneAndUpdate(filter,update,options={}){const old=await this.findOne(filter);if(!old)return null;return this.findByIdAndUpdate(old._id,update,options);}
  static async aggregate(pipeline=[]){let rows=[];for(const stage of pipeline){if(stage.$group){const g=stage.$group;const out={_id:g._id===null?null:undefined};for(const [k,v] of Object.entries(g)){if(k==="_id")continue;if(v.$sum){const field=String(v.$sum).replace(/^\$/,'');const [r]=await pool.execute(`SELECT COALESCE(SUM(\`${field}\`),0) AS total FROM \`${table}\``);out[k]=Number(r[0].total);}}rows=[out];}}return rows;}
 }
 Model.meta=meta; MODEL_REGISTRY[name]=Model; return Model;
}
module.exports={defineModel};
