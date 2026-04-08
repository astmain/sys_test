sudo docker run -d \
  --name postgres17 \
  -p 2001:5432 \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=mydb \
  -v postgres17_data:/var/lib/postgresql/data \
  --restart=always \
  postgres:17
  
  
  
  
  
  # 数据库   127.0.0.1      2001       mydb      postgres/123456
  # VITE_url_db_pg="postgresql://root:123456@101.33.231.94:2001/back?schema=public"
  
  
  主机：localhost
  端口：2001
  用户名：postgres
  密码：123456（你自己设置的密码）
  数据库：mydb