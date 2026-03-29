<?php
    class db{
        public static $conn;

        public static function openCon($server, $user, $db, $pass){
            try{
                $dsn = "mysql:host=$server;dbname=$db";
                self::$conn = new PDO($dsn, $user, $pass);
            } catch (PDOException $e){
                throw new RuntimeException('Error al conectar a la base de datos: '. $e->getMessage());
            }

            return self::$conn;
        }

        public static function closeCon(){
            try{
                self::$conn = null;
            }catch (PDOException $e){
                throw new RangeException('Error al cerrar la base de datos: '. $e->getMessage());
            }
        }

        /**
         * Get the value of conn
         *
         * @return $conn
         */
        public static function getConn(){
            return self::$conn;
        }
    }
?>