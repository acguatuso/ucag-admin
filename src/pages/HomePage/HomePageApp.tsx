
import { useState, useRef, useEffect } from 'react';
import { HomePageEdit } from '../../pages/HomePage';
import './HomePageApp.css'
import { getFirebaseDoc } from '../../api/getFirebaseDoc/getFirebaseDoc';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ref, getDownloadURL }from 'firebase/storage';
import { firebase_storage } from '../../firebase';

export const HomePageApp = () => {
    //informacion de FireStore
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [image_url, setImageUrl] = useState('');

    const navigate = useNavigate();
    // Redux Hooks & Access
    const user = useSelector((state: RootState) => state.auth.user);
    const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
    //console.log(loggedIn)
    const [showEditPage, setShowEditPage] = useState(false);
    const editRef = useRef<any>(null);

    useEffect(() => {
        if (!loggedIn && !user) {
            navigate("/ucag-admin/");
        }
        
        const imageRef = ref(firebase_storage, 'Home/imagen-inicio');
        getDownloadURL(imageRef)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                console.error('Error descargando la imagen:', error);
            });
        (async () => {
            const docSnap = await getFirebaseDoc('/Home/8Yl9xbZuRNFTUItTEKGU');

            setTitulo(docSnap?.titulo);
            setDescripcion(docSnap?.descripcion);

            //setInitialTitulo(docSnap?titulo);

        })()
    }, [loggedIn, user, navigate, showEditPage]);

    const handleEditClick = () => {
        setShowEditPage(true);
        if (editRef.current) {
            editRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCloseEdit = () => {
        setShowEditPage(false);
    }


    return (
        <>
            {loggedIn && (
                <div className="container mt-5">
                    {/* Boton de editar */}
                    <div className='text-start mb-5'>
                        <button type="button" className='btn btn-success' onClick={handleEditClick}>Editar</button>
                    </div>

                    <div className="row text-start">
                        {/* Contenido del lado izquierdo */}
                        <div className="col-sm-5">
                            <h2 className='fw-bold color-title mb-3'>{titulo}</h2>
                            <p>{descripcion} </p>
                        </div>

                        {/* Contenido del lado derecho */}
                        <div className="col-sm-7 d-flex align-items-center justify-content-center"  ref={editRef}>
                            <img
                                src={image_url}
                                alt="Imagen de página de inicio,"
                                className='img-fluid rounded'
                                style={{ width: '500px', height: '300px' }}
                            />
                        </div>
                        {showEditPage && (
                            <HomePageEdit onClose={handleCloseEdit} initialTitulo={titulo} initialDescription={descripcion}/>

                        ) }
                    </div>
                </div>
            )}
        </>

    )
}
