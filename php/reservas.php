<?php
class Database
{
    private $host;
    private $username;
    private $password;
    private $database;
    private $connection;

    public function __construct($host, $username, $password, $database)
    {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
    }

    public function connect()
    {
        $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
        if ($this->connection->connect_error) {
            die("Error en la conexión: " . $this->connection->connect_error);
        }
    }

    public function close()
    {
        $this->connection->close();
    }

    public function getConnection()
    {
        return $this->connection;
    }



}

class RegistroUsuario
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function registrar($nombre, $email, $contrasena)
    {
        $nombre = $this->limpiarDatos($nombre);
        $email = $this->limpiarDatos($email);
        $contrasena = $this->limpiarDatos($contrasena);

        $sql = "SELECT * FROM usuarios WHERE email='$email'";
        $result = $this->conexion->query($sql);

        if ($result->num_rows == 1) {
            echo "Ya existe un usuario con ese correo";
        } else {
            $sql = "INSERT INTO usuarios (nombre, email, contrasena) VALUES ('$nombre', '$email', '$contrasena')";
            if ($this->conexion->query($sql) === TRUE) {
                echo "Registro exitoso. Ahora puedes iniciar sesión.";
            } else {
                echo "Error: " . $sql . "<br>" . $this->conexion->error;
            }
        }

    }

    private function limpiarDatos($datos)
    {
        $datos = trim($datos);
        $datos = stripslashes($datos);
        $datos = htmlspecialchars($datos);
        return $datos;
    }
}

class InicioSesion
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function iniciarSesion($email, $contrasena)
    {
        $email = $this->limpiarDatos($email);
        $contrasena = $this->limpiarDatos($contrasena);

        $sql = "SELECT * FROM usuarios WHERE email='$email' AND contrasena='$contrasena'";
        $result = $this->conexion->query($sql);

        if ($result->num_rows == 1) {
            echo "Inicio de sesión exitoso. ¡Bienvenido!";
            $_SESSION['usuario_id'] = $email;
        } else {
            echo "Credenciales incorrectas. Inténtalo de nuevo.";
        }
    }

    private function limpiarDatos($datos)
    {
        $datos = trim($datos);
        $datos = stripslashes($datos);
        $datos = htmlspecialchars($datos);
        return $datos;
    }
}

class Reserva
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
    }

    public function getUserIdByEmail($email)
    {
        $email = $this->conexion->real_escape_string($email);
        $sql = "SELECT id FROM usuarios WHERE email='$email'";
        $result = $this->conexion->query($sql);

        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $row["id"];
        }

        return null;
    }

    public function realizarReserva($usuario_id, $recurso_id, $fecha_inicio, $fecha_fin)
    {
        $usuario_id = $this->getUserIdByEmail($this->limpiarDatos($usuario_id));
        $recurso_id = $this->limpiarDatos($recurso_id);
        $fecha_inicio = $this->limpiarDatos($fecha_inicio);
        $fecha_fin = $this->limpiarDatos($fecha_fin);

        $sql = "SELECT ocupacion_maxima FROM limites_ocupacion WHERE recurso_id='$recurso_id'";
        $result = $this->conexion->query($sql);

        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $ocupacion_maxima = $row["ocupacion_maxima"];

            $sql = "SELECT COUNT(*) AS ocupacion FROM reservas WHERE recurso_id='$recurso_id' AND (fecha_inicio BETWEEN '$fecha_inicio' AND '$fecha_fin' OR fecha_fin BETWEEN '$fecha_inicio' AND '$fecha_fin')";
            $result = $this->conexion->query($sql);

            if ($result->num_rows == 1) {
                $row = $result->fetch_assoc();
                $ocupacion = $row["ocupacion"];

                if ($ocupacion + 1 <= $ocupacion_maxima) {
                    $sql = "INSERT INTO reservas (usuario_id, recurso_id, fecha_inicio, fecha_fin) VALUES ('$usuario_id', '$recurso_id', '$fecha_inicio', '$fecha_fin')";
                    if ($this->conexion->query($sql) === TRUE) {
                        echo "Reserva realizada con éxito.";
                    } else {
                        echo "Error: " . $sql . "<br>" . $this->conexion->error;
                    }
                } else {
                    echo "El recurso está lleno en las fechas seleccionadas. Por favor, elige otras fechas.";
                }
            }
        }
    }

    public function mostrarReservasUsuario($usuario_id)
    {
        $usuario_id = $this->getUserIdByEmail($this->limpiarDatos($usuario_id));

        $sql = "SELECT r.id, r.fecha_inicio, r.fecha_fin, rc.nombre AS nombre_recurso
                FROM reservas r
                JOIN recursos rc ON r.recurso_id = rc.id
                WHERE r.usuario_id = $usuario_id";

        $result = $this->conexion->query($sql);

        if ($result === false) {
            echo "Error executing query: " . $this->conexion->error;
            return; // or handle the error appropriately
        }
        if ($result->num_rows > 0) {
            echo "<h2>Reservas del usuario:</h2>";
            while ($row = $result->fetch_assoc()) {
                echo "ID de reserva: " . $row["id"] . "<br>";
                echo "Fecha de inicio: " . $row["fecha_inicio"] . "<br>";
                echo "Fecha de fin: " . $row["fecha_fin"] . "<br>";
                echo "Recurso: " . $row["nombre_recurso"] . "<br>";
                echo "<br>";
            }
        } else {
            echo "No se encontraron reservas para el usuario.";
        }
    }

    public function mostrarRecursosDisponibles()
    {
        $sql = "SELECT id, nombre, precio FROM recursos";
        $result = $this->conexion->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "ID de recurso: " . $row["id"] . "<br>";
                echo "Nombre: " . $row["nombre"] . "<br>";
                echo "Precio: " . $row["precio"] . "€<br>";
                echo "<br>";
            }
        } else {
            echo "No se encontraron recursos disponibles.";
        }
    }
    private function limpiarDatos($datos)
    {
        $datos = trim($datos);
        $datos = stripslashes($datos);
        $datos = htmlspecialchars($datos);
        return $datos;
    }
}

// Crear una instancia de la clase Database
$database = new Database("localhost", "DBUSER2021", "DBPSWD2021", "central_reservas");
$database->connect();
$conexion = $database->getConnection();

// Iniciar la sesión
session_start();

$registroUsuario = new RegistroUsuario($conexion);
$inicioSesion = new InicioSesion($conexion);
$reserva = new Reserva($conexion);



if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["registro"])) {
        $nombre = $_POST["nombre"];
        $email = $_POST["email"];
        $contrasena = $_POST["contrasena"];

        $registroUsuario->registrar($nombre, $email, $contrasena);
    } elseif (isset($_POST["inicio_sesion"])) {
        $email = $_POST["email"];
        $contrasena = $_POST["contrasena"];
        $inicioSesion->iniciarSesion($email, $contrasena);
    } elseif (isset($_POST["realizar_reserva"])) {
        $usuario_id = $_SESSION['usuario_id'];
        $recurso_id = $_POST["recurso_id"];
        $fecha_inicio = $_POST["fecha_inicio"];
        $fecha_fin = $_POST["fecha_fin"];

        $reserva->realizarReserva($usuario_id, $recurso_id, $fecha_inicio, $fecha_fin);
    } elseif (isset($_POST["cerrar_sesion"])) {
        session_start();
        session_destroy();
        header("Location: reservas.php"); // Redirige a la página de inicio de sesión
        exit();
    }
}


?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="description" content="Practica Extraordinaria SEW">
    <meta name="keywords" content="HTML,CSS">
    <meta name="author" content="Moises Garcia Lopez">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservas - San Tirso de Abres</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css">
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
    <script
        src='http://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.3.1/leaflet-omnivore.min.js'></script>
    <script src="https://d3js.org/d3.v6.min.js"></script>
</head>

<body>
    <header>
        <nav>
            <a href="../index.html">Página principal</a>
            <a href="../gastronomia.html">Gastronomía</a>
            <a href="../rutas.html">Rutas</a>
            <a href="../meteorologia.html">Meteorología</a>
            <a href="../juego.html">Juego</a>
            <a href="../reservas.html">Reservas</a>
        </nav>
    </header>
    <h1>Central de Reservas</h1>
    <main>
        <?php if (!isset($_SESSION['usuario_id'])): ?>
            <section>
                <!-- Formulario de registro -->
                <h2>Registro de usuario</h2>
                <form method="POST" action="reservas.php?action=registro">
                    <input type="hidden" name="registro" value="true">
                    <p>
                        <label for="nombre">Nombre:</label>
                        <input type="text" name="nombre" id="nombre" required>
                    </p>
                    <p>
                        <label for="email">Email:</label>
                        <input type="email" name="email" id="email" required>
                    </p>
                    <p>
                        <label for="contrasena">Contraseña:</label>
                        <input type="password" name="contrasena" id="contrasena" required>
                    </p>
                    <p>
                        <input type="submit" value="Registrar">
                    </p>
                </form>
            </section>

            <section>
                <!-- Formulario de inicio de sesión -->
                <h2>Iniciar sesión</h2>
                <form method="POST" action="reservas.php?action=inicio_sesion">
                    <input type="hidden" name="inicio_sesion" value="true">
                    <p>
                        <label for="email2">Email:</label>
                        <input type="email" name="email" id="email2" required>
                    </p>
                    <p>
                        <label for="contrasena2">Contraseña:</label>
                        <input type="password" name="contrasena" id="contrasena2" required>
                    </p>
                    <p>
                        <input type="submit" value="Iniciar sesión">
                    </p>
                </form>
            </section>
        <?php else: ?>
            <section>
                <h2>Reservas y recursos turísticos</h2>
                <form method="POST" action="reservas.php?action=reservas.php">
                    <!-- ... código existente ... -->
                    <input type="submit" name="mostrar_reservas" value="Mostrar reservas">
                    <input type="submit" name="mostrar_recursos" value="Mostrar recursos turísticos">
                </form>
            </section>
            <section>
                <h2>Recursos turísticos</h2>
                <?php
                if (isset($_POST["mostrar_recursos"])) {
                    $reserva->mostrarRecursosDisponibles();
                }
                ?>
            </section>

            <section>
                <h2>Reservas</h2>
                <?php
                if (isset($_POST["mostrar_reservas"])) {
                    $usuario_id = $_SESSION['usuario_id'];
                    $reserva->mostrarReservasUsuario($usuario_id);
                }
                ?>
            </section>

            <section>
                <!-- Formulario de reserva -->
                <h2>Realizar reserva</h2>
                <form method="POST" action="reservas.php?action=realizar_reserva">
                    <input type="hidden" name="realizar_reserva" value="true">
                    <p>
                        <label for="recurso_id">ID de recurso:</label>
                        <input type="text" name="recurso_id" id="recurso_id" required>
                    </p>
                    <p>
                        <label for="fecha_inicio">Fecha de inicio:</label>
                        <input type="date" name="fecha_inicio" id="fecha_inicio" required>
                    </p>
                    <p>
                        <label for="fecha_fin">Fecha de fin:</label>
                        <input type="date" name="fecha_fin" id="fecha_fin" required>
                    </p>
                    <p>
                        <input type="submit" value="Realizar reserva">
                    </p>
                </form>
            </section>

        <?php endif; // Cerrar la conexión a la base de datos
        $database->close(); ?>
    </main>
    <footer>
        <p>Proyecto realizado por Moises Garcia Lopez - Universidad de Oviedo</p>
    </footer>
</body>

</html>