// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { auth_fire, data_base} from '../../firebase';
import { Timestamp, collection, addDoc, query, where, getDocs } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';

type UserData = {
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  provincia: string;
  canton: string;
  distrito: string;
  direccion: string;
  fechaNacimiento: Timestamp;
  genero: string;
  user_type: number;
}

type AuthState = {
  notification : string | null;
  emailVerified: boolean;
  loggedIn: boolean;
  user: UserData | null;
  error: string | null;
}

const initialState: AuthState = {
  notification: null,
  emailVerified: false,
  loggedIn: false,
  user: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserData>) => {
      state.loggedIn = true;
      state.user = action.payload;
      state.emailVerified = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loggedIn = false;
      state.user = null;
      state.error = action.payload;
    },
    signupSuccess: (state, action: PayloadAction<{ msg: string, emailVerified: boolean }>) => {
      state.loggedIn = false;
      state.notification = action.payload.msg;
      state.emailVerified = action.payload.emailVerified;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loggedIn = false;
      state.user = null;
      state.error = action.payload;
    },
    logOut: (state) => {
      state.loggedIn = false;
      state.user = null;
    },
  }
});


export const { loginSuccess, loginFailure, signupSuccess, signupFailure,logOut} = authSlice.actions;
export default authSlice.reducer;

export const login = (email: string, password: string): AppThunk => async dispatch => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth_fire, email, password);

    // Verifica si el correo electrónico del usuario está verificado
    if (!userCredential.user.emailVerified) {
      throw new Error('Por favor, verifica tu dirección de correo electrónico antes de iniciar sesión.');
    }

    // Conseguir UserData si está verificado
    const usuarioObtenido: UserData | null = await obtenerUsuario(email);
    // Verificar si se obtuvo el usuario correctamente
    if (usuarioObtenido !== null) {
      // Hacer algo con el objeto de usuario obtenido
      console.log("Usuario obtenido:", usuarioObtenido);
    } else {
      console.log("No se pudo obtener el usuario.");
    }
    
    // Emitir orden de logueo de usuario satisfactorio
    dispatch(loginSuccess(usuarioObtenido!));
  } catch (error:any) {
    const msg = error.message.replace('Firebase: ', '');
    dispatch(loginFailure(msg));
  }
};

const obtenerUsuario = async (userEmail: string): Promise<UserData | null> => {
  // Referencia al documento del usuario en la colección 'Usuarios'
  const usuariosCollectionRef = collection(data_base, "Usuarios");

  try {
    // Query consulta para buscar documentos con el correo electrónico proporcionado
    const db_query = query(usuariosCollectionRef, where("correo", "==", userEmail));
    
    // Obtener el documento del usuario
    const usuarioDocSnap = await getDocs(db_query);
    // Obtener el primer documento en el QuerySnapshot
    const primerDocumento = usuarioDocSnap.docs[0];
    
    // Verificar si el documento existe
    if (primerDocumento) {
      // Obtener los datos del documento
      const userData = primerDocumento.data() as UserData;
      
      // Construir un objeto UserData a partir de los datos
      const userDataObject: UserData = {
        nombre: userData.nombre,
        correo: userData.correo,
        cedula: userData.cedula,
        telefono: userData.telefono,
        provincia: userData.provincia,
        canton: userData.canton,
        distrito: userData.distrito,
        direccion: userData.direccion,
        fechaNacimiento: userData.fechaNacimiento,
        genero: userData.genero,
        user_type: userData.user_type
      };

      return userDataObject;
    } else {
      console.log("No se encontró el documento del usuario");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento del usuario: ", error);
    return null;
  }
}

export const signup = (formData: any): AppThunk => async dispatch => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth_fire, formData.email, formData.password);
      console.log(userCredential.user.email)

      // Agrega el documento a fibrease(Usuarios) collection
      agregarDoc(formData);

      // Envía el correo de verificación
      await sendEmailVerification(userCredential.user);

      const texto = 'Cuenta creada con éxtio!'
      dispatch(signupSuccess({msg: texto!,emailVerified: userCredential.user.emailVerified }));

    } catch (error:any) {
      //console.log(error.message)
      const msg = error.message.replace('Firebase: ', '');
      dispatch(signupFailure(msg));
    }
};

const agregarDoc = async (formData: any) => {
  // Datos del nuevo documento
  const nuevoDocumento : UserData = {
    nombre: formData.name,
    correo: formData.email,
    cedula: formData.cedula,
    telefono: formData.telefono,
    provincia: formData.provincia,
    canton: formData.canton,
    distrito: formData.distrito,
    direccion: formData.direccion,
    fechaNacimiento: Timestamp.fromDate(new Date(formData.fechaNacimiento)),
    genero: formData.genero,
    user_type: parseInt(formData.userType,10)
  };

  // Referencia a la coleccion de 'Usuarios'
  const users_collection_ref = collection(data_base, "Usuarios"); 

  // Agrega el nuevo documento a la colección 'Usuarios'
  try {
    
    const documentoRef = await addDoc(users_collection_ref, nuevoDocumento);
    console.log("Documento agregado con ID: ", documentoRef.id);
  } catch (error) {
    console.error("Error al agregar documento: ", error);
  }
}