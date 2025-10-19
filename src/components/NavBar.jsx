import { Navbar, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <Navbar
      fluid
      className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50"
    >
      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-wrap justify-between items-center w-full px-4 md:px-8">
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="flex items-center gap-2">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="text-lg md:text-xl font-semibold text-white">
            Mi Aula de Inglés
          </span>
        </Navbar.Brand>

        {/* BOTÓN DE MENÚ RESPONSIVE */}
        <Navbar.Toggle className="focus:ring-0 focus:outline-none" />

        {/* ELEMENTOS DEL NAVBAR */}
        <Navbar.Collapse>
          <Navbar.Link as={Link} to="/" active={isActive("/")}>
            Inicio
          </Navbar.Link>
          <Navbar.Link as={Link} to="/alphabet" active={isActive("/#/alphabet")}>
            Alphabet
          </Navbar.Link>
          <Navbar.Link as={Link} to="/questions" active={isActive("/questions")}>
            Personal Info
          </Navbar.Link>
          <Navbar.Link as={Link} to="/jobs" active={isActive("/#/jobs")}>
            Jobs
          </Navbar.Link>
           {/* <Navbar.Link as={Link} to="/nada" active={isActive("/#")}>
            Family
          </Navbar.Link> */}

          {/* BOTONES Y DROPDOWN EN MOBILE */}
          {/* <div className="mt-3 md:hidden flex flex-col gap-2">
            <Button color="blue" size="sm" as={Link} to="/login">
              Ingresar
            </Button>
          </div> */}
        </Navbar.Collapse>

        {/* PERFIL Y BOTÓN (DESKTOP) */}
        {/* <div className="hidden md:flex items-center gap-3">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="Usuario"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Tristán Luna</span>
              <span className="block truncate text-sm font-medium">
                prof.tristan@example.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item as={Link} to="/perfil">
              Perfil
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/configuracion">
              Configuración
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => alert("Cerrando sesión...")}>
              Cerrar sesión
            </Dropdown.Item>
          </Dropdown>

          <Button color="blue" size="sm" as={Link} to="/login">
            Ingresar
          </Button>
        </div> */}
      </div>
    </Navbar>
  );
}
