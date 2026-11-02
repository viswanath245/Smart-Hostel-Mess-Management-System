const mysql = require("mysql2/promise");
const pool = mysql.createPool({host:process.env.MYSQL_HOST||"localhost",port:Number(process.env.MYSQL_PORT||3306),user:process.env.MYSQL_USER||"root",password:process.env.MYSQL_PASSWORD||"",database:process.env.MYSQL_DATABASE||"smart_hostel_mess",waitForConnections:true,connectionLimit:10,queueLimit:0,decimalNumbers:true});
async function connectDB(){try{const c=await pool.getConnection();await c.query("SELECT 1");c.release();console.log("MySQL connected successfully");}catch(e){console.error("MySQL connection failed:",e.message);process.exit(1);}}
module.exports={pool,connectDB};
