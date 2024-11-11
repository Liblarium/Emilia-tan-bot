@echo off

echo "Generate new cluster"
initdb -D "./pgdata" -E UTF8 -A scram-sha-256 --locale en_US.UTF-8 -U ran -W 

echo "Edit port in postgresql.conf"
echo port = 5433 >> pgdata\postgresql.conf

echo "Run new cluster"
pg_ctl -D "./pgdata" start
@pause