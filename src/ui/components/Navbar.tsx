import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logOut } from '../../redux/reducers/authSlice';
import './Navbar.css';
import { ref, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from 'react';
import { firebase_storage } from '../../firebase';

export const Navbar = () => {

    // Redux Hooks & Access
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
    const empresaData = useSelector((state: RootState) => state.empresa.dataEmpresa);

    const navigate = useNavigate();

    const handleLogOut = () => {
        dispatch(logOut());
        navigate('/ucag-admin/iniciar-sesion', { replace: true })
    }

    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => { 
        (async () => {
            const imageRef = ref(firebase_storage, 'Empresa/Logo/logo');
            getDownloadURL(imageRef)
                .then((url) => {
                    setLogoUrl(url);
                })
                .catch((error) => {
                    console.error('Error descargando el logo:', error);
                });
  
        })()
    }, []);

    return (

        <div className="navbar-container shadow-lg">
            <nav className="navbar navbar-expand-sm fixed-top text-dark bg-dark p-2">
                <div className="container-fluid">
                    {user && loggedIn && (
                        <NavLink
                            className="navbar-brand"
                            to="/ucag-admin/home"
                        >
                            <img ref={logoUrl} alt="Logo" width="110" height="80" />

                        </NavLink>)}
                    {!user && !loggedIn && (
                        <NavLink
                            className="navbar-brand"
                            to="/ucag-admin/"
                        >
                            <img ref={logoUrl} alt="Bootstrap" width="110" height="80" />

                        </NavLink>)}
                        <h4 className="navbar-text-white d-none d-sm-inline-block">
                            {empresaData?.titulo_footer ?? 'Unión Cantonal de Asociaciones Guatuso'}
                        </h4>
                    {/* <h4 className='navbar-text-white'>{ empresaData?.nombre ?? 'Unión Cantonal de Asociaciones Guatuso'}</h4> */}
                    <button className="navbar-toggler navbar-dark navbar-toggler-custom" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse navbar-collapse-custom" id="navbarTogglerDemo01">

                        <div className="navbar-collapse ">
                            {user && loggedIn && (
                                ""
                            )}
                        </div>

                        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
                            <ul className="navbar-nav ">

                                {loggedIn && user && (
                                    <div className="navbar-nav">

                                        <NavLink
                                            className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''} navbar-text-white`}
                                            to="/ucag-admin/home"
                                        >
                                            Inicio
                                        </NavLink>
                                        <NavLink
                                            className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''} navbar-text-white`}
                                            to="/ucag-admin/mi-perfil"
                                        >
                                            Mi Perfil
                                        </NavLink>
                                        <NavLink 
                                        className={ ({isActive}) => `nav-item nav-link ${ isActive ? 'active': '' } navbar-text-white`}
                                        to="/ucag-admin/students"
                                         >
                                        Usuarios
                                         </NavLink>

                                        <NavLink
                                            className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''} navbar-text-white`}
                                            to="/ucag-admin/Cursos"
                                        >
                                            Cursos
                                        </NavLink>


                                        <NavLink
                                            className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''} navbar-text-white`}
                                            to="/ucag-admin/servicios"
                                        >
                                            Servicios
                                        </NavLink>

                                        <NavLink
                                            className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''} navbar-text-white`}
                                            to="/ucag-admin/avisos"
                                        >
                                            Avisos
                                        </NavLink>

                                        <NavLink
                                            className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''} navbar-text-white`}
                                            to="/ucag-admin/about"
                                        >
                                            Acerca
                                        </NavLink>

                                        <button className="nav-item nav-link btn navbar-text-white" onClick={handleLogOut}>
                                            <i className="fa-solid fa-right-from-bracket me-2"></i>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

