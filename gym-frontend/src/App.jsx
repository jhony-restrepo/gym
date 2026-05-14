import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Trash2, Dumbbell, 
  Award, User, LogOut, Landmark, PlusCircle, 
  Briefcase, Users as UsersIcon, Utensils, ShoppingBag, 
  DollarSign, CreditCard as CardIcon, ArrowRightLeft, Save, Edit,
  Calendar, TrendingUp, Image as ImageIcon
} from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token_v2'));
  const [rol, setRol] = useState(parseInt(localStorage.getItem('rol_v2')) || 3); 
  const [tab, setTab] = useState('home');
  const [authView, setAuthView] = useState('login');

  const getAvatar = (nombre, apellido) => `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=D4AF37&color=000&bold=true`;

  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem('db_usuarios_v2')) || [
    { id: 1, documento: '000000', nombre: 'Admin', apellido: 'Master', fechaNacimiento: '1990-01-01', email: 'admin@gym.com', password: '123', rol: 1, telefono: '123456', plan: 'Admin', coach: 'N/A', estado: 'Desconectado 🔴', avatar: getAvatar('Admin', 'Master') },
    { id: 2, documento: '111111', nombre: 'Entrenador', apellido: 'Juan', fechaNacimiento: '1995-05-05', email: 'juan@gym.com', password: '123', rol: 2, telefono: '654321', plan: 'Staff', coach: 'N/A', estado: 'Desconectado 🔴', avatar: getAvatar('Entrenador', 'Juan') }
  ]);
  
  const [rutinas, setRutinas] = useState(() => JSON.parse(localStorage.getItem('db_rutinas_v2')) || [{ id: 1, nombre: 'Pecho y Tríceps', desc: '4x12 Press Plano, 3x10 Fondos', imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' }]);
  const [comidas, setComidas] = useState(() => JSON.parse(localStorage.getItem('db_comidas_v2')) || [{ id: 1, nombre: 'Dieta Volumen', desc: 'Arroz, pollo y vegetales. 2500 kcal', imagen: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80' }]);
  const [membresias, setMembresias] = useState(() => JSON.parse(localStorage.getItem('db_membresias_v2')) || [{ id: 1, nombre: 'Plan Black', precio: 150000, imagen: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80' }]);
  const [productos, setProductos] = useState(() => JSON.parse(localStorage.getItem('db_productos_v2')) || [{ id: 101, nombre: 'Proteína Whey', precio: 220000, imagen: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80' }]);
  const [clases, setClases] = useState(() => JSON.parse(localStorage.getItem('db_clases_v2')) || [{ id: 1, nombre: 'Crossfit Extremo', desc: 'Clase de alta intensidad', hora: '18:00', cupos: 15, imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80' }]);
  const [finanzas, setFinanzas] = useState(() => JSON.parse(localStorage.getItem('db_finanzas_v2')) || []);

  const [perfil, setPerfil] = useState(JSON.parse(localStorage.getItem('user_profile_v2')) || {});
  
  // Modales
  const [modalPago, setModalPago] = useState({ abierto: false, item: null, tipo: '' });
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [modalCarrito, setModalCarrito] = useState(false);
  const [modalEditarUser, setModalEditarUser] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ documento: '', nombre: '', apellido: '', fechaNacimiento: '', email: '', password: '', rol: 3 });

  // --- PERSISTENCIA ---
  useEffect(() => {
    localStorage.setItem('db_usuarios_v2', JSON.stringify(usuarios));
    localStorage.setItem('db_rutinas_v2', JSON.stringify(rutinas));
    localStorage.setItem('db_comidas_v2', JSON.stringify(comidas));
    localStorage.setItem('db_membresias_v2', JSON.stringify(membresias));
    localStorage.setItem('db_productos_v2', JSON.stringify(productos));
    localStorage.setItem('db_clases_v2', JSON.stringify(clases));
    localStorage.setItem('db_finanzas_v2', JSON.stringify(finanzas));
    if(token) localStorage.setItem('user_profile_v2', JSON.stringify(perfil));
  }, [usuarios, rutinas, comidas, membresias, productos, clases, finanzas, perfil, token]);

  // --- AUTENTICACIÓN ---
  const ejecutarRegistro = () => {
    const { documento, nombre, apellido, fechaNacimiento, email, password, rol } = regForm;
    if (!documento || !nombre || !apellido || !fechaNacimiento || !email || !password || !rol) return alert("⚠️ Completa todos los campos.");
    if (usuarios.find(u => u.email === email || u.documento === documento)) return alert("⚠️ Correo o documento ya registrados.");

    const nuevoUsuario = { 
      id: Date.now(), ...regForm, telefono: '', compras: [], 
      coach: 'No asignado', plan: 'Ninguno', rutinaActiva: 'Ninguna', comidaActiva: 'Ninguna', 
      estado: 'Desconectado 🔴', progreso: [], clasesReservadas: [],
      avatar: getAvatar(nombre, apellido)
    };
    setUsuarios([...usuarios, nuevoUsuario]);
    alert("✅ Registro exitoso. Inicia sesión.");
    setAuthView('login');
    setRegForm({ documento: '', nombre: '', apellido: '', fechaNacimiento: '', email: '', password: '', rol: 3 });
  };

  const ejecutarLogin = () => {
    const user = usuarios.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      setPerfil(user); setRol(user.rol); setToken('active');
      localStorage.setItem('token_v2', 'active'); localStorage.setItem('rol_v2', user.rol);
      localStorage.setItem('user_profile_v2', JSON.stringify(user));
    } else alert("❌ Credenciales incorrectas.");
  };

  // --- GESTIÓN DE ITEMS (ADMIN) ---
  const handleEditItem = (tipo, id, campo, valor) => {
    if (rol !== 1) return; 
    if (tipo === 'rutinas') setRutinas(rutinas.map(r => r.id === id ? { ...r, [campo]: valor } : r));
    if (tipo === 'comidas') setComidas(comidas.map(c => c.id === id ? { ...c, [campo]: valor } : c));
    if (tipo === 'membresia') setMembresias(membresias.map(m => m.id === id ? { ...m, [campo]: valor } : m));
    if (tipo === 'tienda') setProductos(productos.map(p => p.id === id ? { ...p, [campo]: valor } : p));
    if (tipo === 'clases') setClases(clases.map(c => c.id === id ? { ...c, [campo]: valor } : c));
  };

  const handleAddItem = (tipo) => {
    if (rol !== 1) return;
    const nuevo = { id: Date.now(), nombre: 'Nuevo Item', desc: 'Descripción...', precio: '', imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80', hora: '12:00', cupos: 10 };
    if (tipo === 'rutinas') setRutinas([...rutinas, nuevo]);
    if (tipo === 'comidas') setComidas([...comidas, nuevo]);
    if (tipo === 'membresia') setMembresias([...membresias, nuevo]);
    if (tipo === 'tienda') setProductos([...productos, nuevo]);
    if (tipo === 'clases') setClases([...clases, nuevo]);
  };

  const handleDeleteItem = (tipo, id) => {
    if (rol !== 1) return;
    if (tipo === 'rutinas') setRutinas(rutinas.filter(r => r.id !== id));
    if (tipo === 'comidas') setComidas(comidas.filter(c => c.id !== id));
    if (tipo === 'membresia') setMembresias(membresias.filter(m => m.id !== id));
    if (tipo === 'tienda') setProductos(productos.filter(p => p.id !== id));
    if (tipo === 'clases') setClases(clases.filter(c => c.id !== id));
  };

  // --- GESTIÓN DE USUARIOS (ADMIN) ---
  const eliminarUsuario = (id, nombre) => {
    if (rol !== 1) return;
    if (window.confirm(`¿Estás seguro de eliminar permanentemente a ${nombre}?`)) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const guardarEdicionUsuario = (e) => {
    e.preventDefault();
    setUsuarios(usuarios.map(u => u.id === modalEditarUser.id ? modalEditarUser : u));
    setModalEditarUser(null);
    alert("✅ Usuario actualizado correctamente.");
  };

  // --- ASISTENCIA, RESERVAS Y PROGRESO ---
  const registrarAsistencia = (tipo) => {
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nuevoEstado = tipo === 'entrada' ? 'Activo 🟢' : 'Desconectado 🔴';
    const nuevoPerfil = { ...perfil, [tipo]: hora, estado: nuevoEstado };
    setPerfil(nuevoPerfil);
    setUsuarios(usuarios.map(u => u.id === perfil.id ? nuevoPerfil : u));
    alert(`✅ ${tipo.toUpperCase()} registrada a las ${hora}.`);
  };

  const registrarProgreso = (e) => {
    e.preventDefault();
    if(!e.target.peso.value) return;
    const nuevoRegistro = { id: Date.now(), fecha: new Date().toLocaleDateString(), peso: e.target.peso.value };
    const nuevoPerfil = { ...perfil, progreso: [nuevoRegistro, ...(perfil.progreso || [])] };
    setPerfil(nuevoPerfil); setUsuarios(usuarios.map(u => u.id === perfil.id ? nuevoPerfil : u));
    e.target.reset();
  };

  const reservarClase = (clase) => {
    const misClases = perfil.clasesReservadas || [];
    if (misClases.find(c => c.id === clase.id)) return alert("⚠️ Ya tienes reservada esta clase.");
    if (clase.cupos <= 0) return alert("⚠️ Ya no hay cupos disponibles.");
    
    // Restar un cupo
    setClases(clases.map(c => c.id === clase.id ? { ...c, cupos: c.cupos - 1 } : c));
    const nuevoPerfil = { ...perfil, clasesReservadas: [...misClases, clase] };
    setPerfil(nuevoPerfil);
    setUsuarios(usuarios.map(u => u.id === perfil.id ? nuevoPerfil : u));
    alert(`✅ Lugar reservado para ${clase.nombre} a las ${clase.hora}`);
  };

  const actualizarDatosPerfil = (e) => {
    e.preventDefault();
    setUsuarios(usuarios.map(u => u.id === perfil.id ? perfil : u));
    alert("✅ Datos actualizados correctamente");
  };

  // --- COMPRAS Y CARRITO ---
  const seleccionarServicio = (campo, valor) => {
    const nuevoPerfil = { ...perfil, [campo]: valor };
    setPerfil(nuevoPerfil);
    setUsuarios(usuarios.map(u => u.id === perfil.id ? nuevoPerfil : u));
    alert(`✅ Excelente, has seleccionado: ${valor}`);
  };

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]); alert(`🛒 ${producto.nombre} agregado al carrito.`);
  };

  const confirmarPagoMembresia = (metodo) => {
    const nuevaVenta = { id: Date.now(), monto: Number(modalPago.item.precio)||0, producto: modalPago.item.nombre, metodo, fecha: new Date().toISOString(), usuario: perfil.nombre };
    setFinanzas([...finanzas, nuevaVenta]);
    seleccionarServicio('plan', modalPago.item.nombre);
    setModalPago({ abierto: false, item: null, tipo: '' });
    setCompraExitosa(true); setTimeout(() => setCompraExitosa(false), 3000);
  };

  const confirmarPagoCarrito = (metodo) => {
    const total = carrito.reduce((acc, curr) => acc + (Number(curr.precio) || 0), 0);
    const nuevaVenta = { id: Date.now(), monto: total, producto: carrito.map(c=>c.nombre).join(', '), metodo, fecha: new Date().toISOString(), usuario: perfil.nombre };
    setFinanzas([...finanzas, nuevaVenta]);
    const pActualizado = { ...perfil, compras: [...(perfil.compras || []), ...carrito.map(c => c.nombre)] };
    setPerfil(pActualizado); setUsuarios(usuarios.map(u => u.id === perfil.id ? pActualizado : u));
    setCarrito([]); setModalCarrito(false);
    setCompraExitosa(true); setTimeout(() => setCompraExitosa(false), 3000);
  };

  // ---------------- UI: AUTENTICACIÓN ----------------
  if (!token) {
    return (
      <div style={styles.authLayout}>
        <div style={styles.authImagePanel}>
          <div style={styles.authImageOverlay}>
            <h1 style={{fontSize: 55, margin: 0}}>ZENITH <span style={{color: '#D4AF37'}}>PRO</span></h1>
            <p style={{fontSize: 20, opacity: 0.9}}>Forja tu mejor versión con la plataforma definitiva.</p>
          </div>
        </div>
        <div style={styles.authFormPanel}>
          <div style={{width: '100%', maxWidth: '400px'}}>
            <h2 style={{color: '#fff', fontSize: 28, marginBottom: 5}}>{authView === 'login' ? 'Bienvenido de vuelta' : 'Únete al equipo'}</h2>
            <p style={{color: '#888', marginBottom: 30}}>{authView === 'login' ? 'Ingresa tus credenciales para continuar.' : 'Completa tus datos para crear tu cuenta.'}</p>
            {authView === 'login' ? (
              <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                <input placeholder="Correo electrónico" style={styles.inputS} onChange={e=>setLoginForm({...loginForm, email:e.target.value})} />
                <input type="password" placeholder="Contraseña" style={styles.inputS} onChange={e=>setLoginForm({...loginForm, password:e.target.value})} />
                <button onClick={ejecutarLogin} className="btn-hover" style={styles.btnGold}>INGRESAR AL SISTEMA</button>
                <p onClick={()=>setAuthView('register')} style={styles.toggleAuth}>¿No tienes cuenta? <span style={{color:'#D4AF37'}}>Regístrate aquí</span></p>
              </div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'15px', maxHeight:'70vh', overflowY:'auto', paddingRight:10}}>
                <input placeholder="Documento de Identidad" style={styles.inputS} onChange={e=>setRegForm({...regForm, documento:e.target.value})} />
                <div style={{display:'flex', gap:'10px'}}>
                  <input placeholder="Nombre" style={styles.inputS} onChange={e=>setRegForm({...regForm, nombre:e.target.value})} />
                  <input placeholder="Apellido" style={styles.inputS} onChange={e=>setRegForm({...regForm, apellido:e.target.value})} />
                </div>
                <div style={{textAlign:'left'}}><label style={{color:'#888', fontSize:12, marginLeft:5}}>Fecha de Nacimiento</label><input type="date" style={styles.inputS} onChange={e=>setRegForm({...regForm, fechaNacimiento:e.target.value})} /></div>
                <input type="email" placeholder="Correo Electrónico" style={styles.inputS} onChange={e=>setRegForm({...regForm, email:e.target.value})} />
                <input type="password" placeholder="Contraseña" style={styles.inputS} onChange={e=>setRegForm({...regForm, password:e.target.value})} />
                <div style={{textAlign:'left'}}>
                  <label style={{color:'#888', fontSize:12, marginLeft:5}}>Tipo de Rol</label>
                  <div style={{display:'flex', gap:'5px', marginTop:5}}>
                    <button onClick={()=>setRegForm({...regForm, rol:1})} style={regForm.rol===1?styles.btnRoleActive:styles.btnRole}>Admin</button>
                    <button onClick={()=>setRegForm({...regForm, rol:2})} style={regForm.rol===2?styles.btnRoleActive:styles.btnRole}>Coach</button>
                    <button onClick={()=>setRegForm({...regForm, rol:3})} style={regForm.rol===3?styles.btnRoleActive:styles.btnRole}>Cliente</button>
                  </div>
                </div>
                <button onClick={ejecutarRegistro} className="btn-hover" style={{...styles.btnGold, marginTop:10}}>CREAR CUENTA</button>
                <p onClick={()=>setAuthView('login')} style={styles.toggleAuth}>¿Ya tienes cuenta? <span style={{color:'#D4AF37'}}>Inicia sesión</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- UI: APLICACIÓN PRINCIPAL ----------------
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.6); }
        .btn-hover { transition: opacity 0.2s; }
        .btn-hover:hover { opacity: 0.85; }
      `}</style>

      <div style={styles.mainLayout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarLogo}>ZENITH <span style={{color:'#D4AF37'}}>PRO</span></div>
          <nav style={{flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
            <NavBtn active={tab==='home'} onClick={()=>setTab('home')} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
            {(rol === 1 || rol === 2) && <NavBtn active={tab==='clientes'} onClick={()=>setTab('clientes')} icon={<UsersIcon size={20}/>} label="Clientes" />}
            {rol === 1 && <NavBtn active={tab==='finanzas'} onClick={()=>setTab('finanzas')} icon={<Landmark size={20}/>} label="Finanzas" />}
            {(rol === 1 || rol === 3) && <NavBtn active={tab==='membresia'} onClick={()=>setTab('membresia')} icon={<Award size={20}/>} label="Membresías" />}
            
            <p style={styles.navCategory}>SERVICIOS</p>
            <NavBtn active={tab==='clases'} onClick={()=>setTab('clases')} icon={<Calendar size={20}/>} label="Clases Grupales" />
            <NavBtn active={tab==='rutinas'} onClick={()=>setTab('rutinas')} icon={<Dumbbell size={20}/>} label="Rutinas" />
            <NavBtn active={tab==='comidas'} onClick={()=>setTab('comidas')} icon={<Utensils size={20}/>} label="Nutrición" />
            <NavBtn active={tab==='tienda'} onClick={()=>setTab('tienda')} icon={<ShoppingBag size={20}/>} label="Tienda" />
            
            <p style={styles.navCategory}>CUENTA</p>
            {rol === 3 && <NavBtn active={tab==='progreso'} onClick={()=>setTab('progreso')} icon={<TrendingUp size={20}/>} label="Mi Progreso" />}
            {(rol === 1 || rol === 3) && <NavBtn active={tab==='staff'} onClick={()=>setTab('staff')} icon={<Briefcase size={20}/>} label="Staff" />}
            <NavBtn active={tab==='perfil'} onClick={()=>setTab('perfil')} icon={<User size={20}/>} label="Configuración" />
          </nav>
          
          {/* AQUÍ ESTÁ EL BOTÓN DE CERRAR SESIÓN CORREGIDO */}
          <button onClick={()=>{
            localStorage.removeItem('token_v2');
            localStorage.removeItem('rol_v2');
            localStorage.removeItem('user_profile_v2');
            window.location.reload();
          }} style={styles.btnLogout} className="btn-hover">
            <LogOut size={18}/> Cerrar Sesión
          </button>
        </aside>

        <main style={styles.contentArea}>
          {compraExitosa && <div style={styles.toast}>¡Transacción exitosa! 🏆</div>}

          {/* MODAL PAGO */}
          {modalPago.abierto && (
            <div style={styles.modalOverlay}><div style={styles.modal}>
                <h3 style={{marginTop:0}}>Finalizar Compra</h3>
                <img src={modalPago.item.imagen} alt="Item" style={{width:'100%', height:120, objectFit:'cover', borderRadius:10, marginBottom:15}} />
                <p>Estás adquiriendo: <b>{modalPago.item.nombre}</b></p>
                <p>Total a pagar: <b style={{color:'#D4AF37', fontSize:24}}>${Number(modalPago.item.precio).toLocaleString()}</b></p>
                <div style={styles.payGrid}>
                  <button onClick={()=>confirmarPagoMembresia('Efectivo')} className="btn-hover" style={styles.payBtn}><DollarSign/> Efectivo</button>
                  <button onClick={()=>confirmarPagoMembresia('Tarjeta')} className="btn-hover" style={styles.payBtn}><CardIcon/> Tarjeta</button>
                  <button onClick={()=>confirmarPagoMembresia('Transferencia')} className="btn-hover" style={styles.payBtn}><ArrowRightLeft/> Transf.</button>
                </div>
                <button onClick={()=>setModalPago({abierto:false, item:null, tipo:''})} style={styles.btnCancel}>Cancelar</button>
            </div></div>
          )}

          {/* MODAL CARRITO */}
          {modalCarrito && (
            <div style={styles.modalOverlay}><div style={styles.modal}>
              <h3 style={{marginTop:0}}>Tu Carrito 🛒</h3>
              {carrito.length === 0 ? <p>El carrito está vacío.</p> : (
                <><ul style={{textAlign:'left', padding:0, listStyle:'none', color:'#ccc', maxHeight:'250px', overflowY:'auto'}}>{carrito.map((c, i) => (<li key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', background:'#151515', padding:10, borderRadius:8, marginBottom:10}}><div style={{display:'flex', alignItems:'center', gap:10}}><img src={c.imagen} alt={c.nombre} style={{width:40, height:40, borderRadius:5, objectFit:'cover'}} /><div><p style={{margin:0, fontSize:14}}>{c.nombre}</p><b style={{color:'#D4AF37', fontSize:14}}>${Number(c.precio).toLocaleString()}</b></div></div><button onClick={()=>setCarrito(carrito.filter((_, idx)=>idx!==i))} style={{background:'#222', border:'none', color:'#f87171', padding:8, borderRadius:5, cursor:'pointer'}}><Trash2 size={16}/></button></li>))}</ul>
                <h3 style={{color:'#D4AF37', margin:'15px 0'}}>Total: ${carrito.reduce((a,b)=>a+(Number(b.precio)||0), 0).toLocaleString()}</h3>
                <div style={styles.payGrid}>
                  <button onClick={()=>confirmarPagoCarrito('Efectivo')} className="btn-hover" style={styles.payBtn}><DollarSign/> Efectivo</button>
                  <button onClick={()=>confirmarPagoCarrito('Tarjeta')} className="btn-hover" style={styles.payBtn}><CardIcon/> Tarjeta</button>
                  <button onClick={()=>confirmarPagoCarrito('Transferencia')} className="btn-hover" style={styles.payBtn}><ArrowRightLeft/> Transf.</button>
                </div></>
              )}
              <button onClick={()=>setModalCarrito(false)} style={styles.btnCancel}>Cerrar</button>
            </div></div>
          )}

          {/* MODAL EDITAR USUARIO (ADMIN) */}
          {modalEditarUser && (
            <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                <h3 style={{marginTop:0}}>Editar {modalEditarUser.rol === 3 ? 'Cliente' : 'Staff'}</h3>
                <form onSubmit={guardarEdicionUsuario} style={{display:'flex', flexDirection:'column', gap:10, textAlign:'left'}}>
                  <div><label style={styles.label}>Nombre</label><input style={styles.inputS} value={modalEditarUser.nombre} onChange={e=>setModalEditarUser({...modalEditarUser, nombre: e.target.value})} /></div>
                  <div><label style={styles.label}>Plan Activo</label><input style={styles.inputS} value={modalEditarUser.plan} onChange={e=>setModalEditarUser({...modalEditarUser, plan: e.target.value})} /></div>
                  <div><label style={styles.label}>Coach Asignado</label><input style={styles.inputS} value={modalEditarUser.coach} onChange={e=>setModalEditarUser({...modalEditarUser, coach: e.target.value})} /></div>
                  <button type="submit" className="btn-hover" style={{...styles.btnGold, marginTop:15}}>Guardar Cambios</button>
                  <button type="button" onClick={()=>setModalEditarUser(null)} style={styles.btnCancel}>Cancelar</button>
                </form>
              </div>
            </div>
          )}

          {/* CONTENIDO DINÁMICO */}
          {tab === 'home' && (
            <div className="fade-in">
              <header style={{
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.6) 100%), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80)',
                  backgroundSize: 'cover', backgroundPosition: 'center', padding: '40px 30px', borderRadius: 15, border: '1px solid #333',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'
              }}>
                 <div style={{display:'flex', alignItems:'center', gap:20}}>
                   <img src={perfil.avatar} alt="Avatar" style={{width:70, height:70, borderRadius:'50%', border:'2px solid #D4AF37'}} />
                   <div>
                     <h1 style={{margin:0, fontSize:32}}>Hola, {perfil.nombre} 👋</h1>
                     <p style={{color:'#ccc', margin:'5px 0 0 0'}}>Bienvenido a tu panel de control Zenith.</p>
                   </div>
                 </div>
                 <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                    <span style={{padding:'8px 15px', borderRadius:20, fontSize:13, fontWeight:'bold', background:'rgba(0,0,0,0.8)', border:`1px solid ${perfil.estado === 'Activo 🟢' ? '#4ade80' : '#f87171'}`, color: perfil.estado === 'Activo 🟢' ? '#4ade80' : '#f87171'}}>
                      Estado: {perfil.estado || 'Desconectado 🔴'}
                    </span>
                    <div style={{display:'flex', gap:'10px'}}>
                      <button onClick={()=>registrarAsistencia('entrada')} className="btn-hover" style={styles.btnEntry}>Entrada</button>
                      <button onClick={()=>registrarAsistencia('salida')} className="btn-hover" style={styles.btnExit}>Salida</button>
                    </div>
                 </div>
              </header>
              
              {rol === 3 && (
                <>
                  <h3 style={{marginTop:30, borderBottom:'1px solid #333', paddingBottom:10}}>Tu Resumen General</h3>
                  <div style={styles.statsGrid}>
                    <StatCard title="Entrada Hoy" val={perfil.entrada || '--:--'} />
                    <StatCard title="Membresía Activa" val={perfil.plan || 'Ninguna'} accent />
                    <StatCard title="Entrenador Asignado" val={perfil.coach || 'Sin asignar'} />
                  </div>
                  
                  <div style={{display:'flex', gap:20, marginTop:20, flexWrap:'wrap'}}>
                    <div style={styles.clientHomeCard}>
                      <h4 style={styles.cardTitle}><Dumbbell size={18}/> Mi Entrenamiento</h4>
                      <p><b>Rutina:</b> {perfil.rutinaActiva || 'No seleccionada'}</p>
                      <p><b>Dieta:</b> {perfil.comidaActiva || 'No seleccionada'}</p>
                    </div>
                    
                    <div style={styles.clientHomeCard}>
                      <h4 style={styles.cardTitle}><Calendar size={18}/> Mis Clases Grupales</h4>
                      {perfil.clasesReservadas && perfil.clasesReservadas.length > 0 ? (
                        <ul style={{paddingLeft: 20, margin:0, color:'#ccc'}}>
                          {perfil.clasesReservadas.map((c, i) => (
                            <li key={i} style={{marginBottom: 8}}><b>{c.nombre}</b> - {c.hora}</li>
                          ))}
                        </ul>
                      ) : <p style={{color:'#888'}}>Aún no tienes clases reservadas.</p>}
                    </div>

                    <div style={styles.clientHomeCard}>
                      <h4 style={styles.cardTitle}><ShoppingBag size={18}/> Últimas Compras</h4>
                      <p>{perfil.compras?.length ? perfil.compras.join(', ') : 'Aún no has comprado nada.'}</p>
                    </div>
                  </div>
                </>
              )}

              {(rol === 1 || rol === 2) && (
                <>
                  <h3 style={{marginTop:30, borderBottom:'1px solid #333', paddingBottom:10}}>Métricas Globales</h3>
                  <div style={styles.statsGrid}>
                    <StatCard title="Clientes Activos" val={usuarios.filter(u => u.rol === 3 && u.plan !== 'Ninguno' && u.plan !== '').length} accent />
                    <StatCard title="Total Clientes Registrados" val={usuarios.filter(u => u.rol === 3).length} />
                    {rol === 1 && <StatCard title="Staff Activo" val={usuarios.filter(u => u.rol === 2).length} />}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TABS DE EDICIÓN CON IMÁGENES */}
          {['membresia', 'tienda', 'rutinas', 'comidas', 'clases'].includes(tab) && (
            <div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
                <h2 style={{textTransform:'capitalize', margin:0}}>{tab === 'comidas' ? 'Planes de Nutrición' : tab === 'clases' ? 'Calendario de Clases' : tab}</h2>
                <div style={{display:'flex', gap:10}}>
                  {tab === 'tienda' && rol === 3 && <button onClick={()=>setModalCarrito(true)} className="btn-hover" style={styles.btnGoldSmall}><ShoppingCart size={18}/> Ver Carrito ({carrito.length})</button>}
                  {rol === 1 && <button onClick={()=>handleAddItem(tab)} className="btn-hover" style={styles.btnGoldSmall}><PlusCircle size={18}/> Añadir Nuevo</button>}
                </div>
              </div>

              <div style={styles.cardGrid}>
                {(tab==='rutinas'?rutinas : tab==='comidas'?comidas : tab==='membresia'?membresias : tab==='clases'?clases : productos).map(item => (
                  <div key={item.id} className="card-hover" style={styles.itemCard}>
                    <div style={{position:'relative', height: '180px'}}>
                      <img src={item.imagen} alt={item.nombre} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'15px 15px 0 0'}} />
                      {rol === 1 && <div style={{position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.7)', padding:'5px', borderRadius:'8px'}}><button onClick={()=>handleDeleteItem(tab, item.id)} style={{background:'none', border:'none', color:'#f87171', cursor:'pointer'}}><Trash2 size={16}/></button></div>}
                    </div>
                    <div style={{padding:'20px'}}>
                      {rol === 1 && <div style={{display:'flex', alignItems:'center', gap:5, marginBottom:10}}><ImageIcon size={14} color="#888"/><input style={{...styles.inputEdit, fontSize:12, color:'#888', fontWeight:'normal'}} placeholder="URL Imagen" value={item.imagen} onChange={e => handleEditItem(tab, item.id, 'imagen', e.target.value)} /></div>}
                      <input style={styles.inputEdit} value={item.nombre} disabled={rol !== 1} onChange={e => handleEditItem(tab, item.id, 'nombre', e.target.value)} />
                      {(tab === 'rutinas' || tab === 'comidas' || tab === 'clases') && <textarea style={styles.areaEdit} value={item.desc} disabled={rol !== 1} onChange={e => handleEditItem(tab, item.id, 'desc', e.target.value)} />}
                      {tab === 'clases' && (
                        <div style={{display:'flex', justifyContent:'space-between', marginTop:10, fontSize:13, color:'#aaa', background:'#1a1a1a', padding:10, borderRadius:8}}>
                          <span><b>Hora:</b> <input type="time" style={{background:'transparent', border:'none', color:'#fff'}} value={item.hora} disabled={rol!==1} onChange={e => handleEditItem(tab, item.id, 'hora', e.target.value)} /></span>
                          <span><b>Cupos:</b> <input type="number" style={{background:'transparent', border:'none', color:'#fff', width:40}} value={item.cupos} disabled={rol!==1} onChange={e => handleEditItem(tab, item.id, 'cupos', e.target.value)} /></span>
                        </div>
                      )}
                      {(tab === 'membresia' || tab === 'tienda') && <div style={{display:'flex', alignItems:'center', color:'#D4AF37', fontSize:22, fontWeight:'800', marginTop:10}}>$<input type="number" style={{...styles.inputEdit, color:'#D4AF37', fontSize:22, marginLeft:5}} value={item.precio} disabled={rol !== 1} onChange={e => handleEditItem(tab, item.id, 'precio', e.target.value === '' ? '' : Number(e.target.value))} /></div>}
                      {rol === 3 && (
                        <button className="btn-hover" onClick={() => {
                            if(tab === 'membresia') setModalPago({ abierto: true, item, tipo: 'membresia' });
                            else if(tab === 'tienda') agregarAlCarrito(item);
                            else if(tab === 'clases') reservarClase(item);
                            else seleccionarServicio(tab === 'rutinas' ? 'rutinaActiva' : 'comidaActiva', item.nombre);
                        }} style={tab === 'membresia' || tab === 'tienda' ? styles.btnGoldAction : styles.btnOutlineAction}>
                          {tab === 'membresia' ? 'COMPRAR PLAN' : tab === 'tienda' ? 'AÑADIR AL CARRITO' : tab === 'clases' ? 'RESERVAR CUPO' : 'SELECCIONAR'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LISTA CLIENTES CON FOTO Y BOTONES ADMIN */}
          {tab === 'clientes' && (
             <div>
              <h2>Directorio de Clientes</h2>
              <div style={styles.cardGrid}>
                {usuarios.filter(u => u.rol === 3).map(u => (
                  <div key={u.id} className="card-hover" style={{...styles.itemCard, padding:25}}>
                    <div style={{display:'flex', gap:15, alignItems:'center', marginBottom:15}}>
                      <img src={u.avatar} alt={u.nombre} style={{width:50, height:50, borderRadius:'50%'}} />
                      <div>
                        <h3 style={{margin:0}}>{u.nombre} {u.apellido}</h3>
                        <p style={{fontSize:12, color:'#888', margin:0}}>{u.email}</p>
                      </div>
                    </div>
                    <span style={{fontSize:11, background:'#222', padding:'4px 8px', borderRadius:10, color: u.estado === 'Activo 🟢' ? '#4ade80' : '#f87171'}}>{u.estado || 'Desconectado 🔴'}</span>
                    <hr style={{borderColor:'#222', margin:'15px 0'}}/>
                    <div style={{fontSize:13, display:'flex', flexDirection:'column', gap:5}}>
                      <span><b>Plan:</b> {u.plan}</span>
                      <span><b>Coach:</b> {u.coach}</span>
                      <span><b>Asistencia:</b> Entrada {u.entrada||'--'} | Salida {u.salida||'--'}</span>
                    </div>
                    
                    {rol === 1 && (
                      <div style={{display:'flex', gap:10, marginTop:20}}>
                        <button onClick={()=>setModalEditarUser(u)} className="btn-hover" style={{...styles.btnOutlineAction, marginTop:0, display:'flex', justifyContent:'center', alignItems:'center', gap:5}}><Edit size={14}/> Editar</button>
                        <button onClick={()=>eliminarUsuario(u.id, u.nombre)} className="btn-hover" style={{...styles.btnOutlineAction, marginTop:0, border:'1px solid #f87171', color:'#f87171', display:'flex', justifyContent:'center', alignItems:'center', gap:5}}><Trash2 size={14}/> Eliminar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
             </div>
          )}

          {/* LISTA STAFF CON FOTO Y BOTONES ADMIN */}
          {tab === 'staff' && (
            <div>
              <h2>Equipo de Entrenadores</h2>
              <div style={styles.cardGrid}>
                {usuarios.filter(u => u.rol === 2).map(u => (
                  <div key={u.id} className="card-hover" style={{...styles.itemCard, padding:25, textAlign:'center'}}>
                    <img src={u.avatar} alt={u.nombre} style={{width:80, height:80, borderRadius:'50%', margin:'0 auto 15px auto', border:'2px solid #D4AF37'}} />
                    <h3 style={{margin:0}}>{u.nombre} {u.apellido}</h3>
                    <p style={{fontSize:13, color:'#888', margin:'5px 0 10px 0'}}>{u.email}</p>
                    <span style={{fontSize:11, background:'#222', padding:'4px 8px', borderRadius:10, color: u.estado === 'Activo 🟢' ? '#4ade80' : '#f87171'}}>{u.estado || 'Desconectado 🔴'}</span>
                    
                    {rol === 3 && <button onClick={() => seleccionarServicio('coach', `${u.nombre} ${u.apellido}`)} className="btn-hover" style={{...styles.btnOutlineAction, marginTop:20}}>Elegir como Coach</button>}
                    
                    {rol === 1 && (
                      <div style={{display:'flex', gap:10, marginTop:20}}>
                        <button onClick={()=>setModalEditarUser(u)} className="btn-hover" style={{...styles.btnOutlineAction, marginTop:0, display:'flex', justifyContent:'center', alignItems:'center', gap:5}}><Edit size={14}/> Editar</button>
                        <button onClick={()=>eliminarUsuario(u.id, u.nombre)} className="btn-hover" style={{...styles.btnOutlineAction, marginTop:0, border:'1px solid #f87171', color:'#f87171', display:'flex', justifyContent:'center', alignItems:'center', gap:5}}><Trash2 size={14}/> Eliminar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERFIL (CONFIGURACIÓN) RECUPERADO */}
          {tab === 'perfil' && (
            <div style={{maxWidth:600}}>
              <h2>Configuración de Cuenta</h2>
              <div style={{background:'#111', padding:30, borderRadius:15, border:'1px solid #222'}}>
                <div style={{display:'flex', alignItems:'center', gap:20, marginBottom:30}}>
                  <img src={perfil.avatar} alt="Avatar" style={{width:80, height:80, borderRadius:'50%', border:'2px solid #D4AF37'}} />
                  <div>
                    <h3 style={{margin:0}}>{perfil.nombre} {perfil.apellido}</h3>
                    <p style={{color:'#888', margin:0}}>{perfil.email} • Rol: {perfil.rol === 1 ? 'Admin' : perfil.rol === 2 ? 'Coach' : 'Cliente'}</p>
                  </div>
                </div>
                <form onSubmit={actualizarDatosPerfil} style={{display:'flex', flexDirection:'column', gap:15}}>
                   <div style={{display:'flex', gap:15}}>
                     <div style={{flex:1}}><label style={styles.label}>Nombre</label><input style={styles.inputS} value={perfil.nombre || ''} onChange={e=>setPerfil({...perfil, nombre:e.target.value})} /></div>
                     <div style={{flex:1}}><label style={styles.label}>Apellido</label><input style={styles.inputS} value={perfil.apellido || ''} onChange={e=>setPerfil({...perfil, apellido:e.target.value})} /></div>
                   </div>
                   <label style={styles.label}>Correo Electrónico</label><input style={styles.inputS} value={perfil.email || ''} onChange={e=>setPerfil({...perfil, email:e.target.value})} />
                   <label style={styles.label}>Teléfono</label><input style={styles.inputS} value={perfil.telefono || ''} onChange={e=>setPerfil({...perfil, telefono:e.target.value})} />
                   <label style={styles.label}>Contraseña</label><input type="password" style={styles.inputS} value={perfil.password || ''} onChange={e=>setPerfil({...perfil, password:e.target.value})} />
                   <button type="submit" className="btn-hover" style={{...styles.btnGold, marginTop:10}}><Save size={18}/> Guardar Cambios del Perfil</button>
                </form>
              </div>
            </div>
          )}

          {/* FINANZAS Y PROGRESO */}
          {tab === 'finanzas' && (
            <div>
              <h2>Reporte Financiero</h2>
              <StatCard title="Ingresos Totales" val={`$${finanzas.reduce((acc, curr) => acc + curr.monto, 0).toLocaleString()}`} accent />
              <table style={styles.table}>
                <thead><tr><th>Fecha</th><th>Cliente</th><th>Compra</th><th>Método</th><th>Total</th></tr></thead>
                <tbody>{finanzas.map(f => (<tr key={f.id}><td>{new Date(f.fecha).toLocaleDateString()}</td><td>{f.usuario}</td><td>{f.producto}</td><td>{f.metodo}</td><td style={{color:'#4ade80'}}>${f.monto.toLocaleString()}</td></tr>))}</tbody>
              </table>
            </div>
          )}
          
          {tab === 'progreso' && rol === 3 && (
            <div>
              <h2>Registro de Progreso Físico</h2>
              <div style={{display:'flex', gap:20, flexWrap:'wrap'}}>
                <div style={{flex:1, minWidth:300, background:'#111', padding:25, borderRadius:15, border:'1px solid #222'}}>
                  <h4 style={{marginTop:0}}>Nuevo Registro</h4>
                  <form onSubmit={registrarProgreso} style={{display:'flex', flexDirection:'column', gap:15}}>
                    <label style={{fontSize:12, color:'#888'}}>Peso actual (kg)</label>
                    <input name="peso" type="number" step="0.1" style={styles.inputS} placeholder="Ej: 75.5" required />
                    <button type="submit" className="btn-hover" style={styles.btnGold}><Save size={18}/> Guardar Registro</button>
                  </form>
                </div>
                <div style={{flex:2, minWidth:300}}>
                  <table style={styles.table}>
                    <thead><tr><th>Fecha</th><th>Peso Registrado</th></tr></thead>
                    <tbody>
                      {perfil.progreso && perfil.progreso.length > 0 ? perfil.progreso.map(p => (
                        <tr key={p.id}><td>{p.fecha}</td><td style={{color:'#D4AF37', fontWeight:'bold'}}>{p.peso} kg</td></tr>
                      )) : <tr><td colSpan="2" style={{textAlign:'center', color:'#888'}}>No hay registros aún.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

// Estilos visuales adaptados
const NavBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} style={{ 
    display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', borderRadius:'10px', border:'none',
    background: active ? 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 100%)' : 'transparent', 
    color: active ? '#D4AF37' : '#999',
    borderLeft: active ? '3px solid #D4AF37' : '3px solid transparent',
    cursor:'pointer', width:'100%', textAlign:'left', transition:'all 0.2s', fontWeight: active ? '600' : '400', fontSize:'14px'
  }}>{icon} {label}</button>
);

const StatCard = ({ title, val, accent }) => (
  <div className="card-hover" style={{ background: '#111', padding: '25px', borderRadius: '15px', border: accent ? '1px solid #D4AF3740' : '1px solid #222', flex:1, minWidth:'200px', position:'relative', overflow:'hidden' }}>
    {accent && <div style={{position:'absolute', top:0, left:0, width:'100%', height:'4px', background:'#D4AF37'}}></div>}
    <small style={{ color: '#888', textTransform: 'uppercase', fontSize:'11px', letterSpacing:1, fontWeight:'bold' }}>{title}</small>
    <h2 style={{ margin: '8px 0 0 0', color: accent ? '#D4AF37' : '#fff', fontSize:'28px', fontWeight:'800' }}>{val}</h2>
  </div>
);

const styles = {
  authLayout: { display:'flex', height:'100vh', background:'#050505', color:'#fff' },
  authImagePanel: { flex: 1.2, backgroundImage: 'url(https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
  authImageOverlay: { background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', padding: '60px', width: '100%' },
  authFormPanel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#0B0B0B' },
  mainLayout: { display:'flex', height:'100vh', background:'#050505', color:'#fff' },
  sidebar: { width:'280px', background:'#0B0B0B', padding:'30px 20px', borderRight:'1px solid #1a1a1a', display:'flex', flexDirection:'column' },
  sidebarLogo: { fontSize:'26px', fontWeight:'900', marginBottom:'40px', textAlign:'center', letterSpacing:'2px' },
  navCategory: { fontSize:'10px', color:'#555', letterSpacing:'2px', fontWeight:'bold', marginTop:'20px', marginBottom:'10px', paddingLeft:'16px' },
  contentArea: { flex:1, padding:'40px', overflowY:'auto' },
  label: { fontSize:'12px', color:'#888', marginBottom:'5px', display:'block' },
  inputS: { width:'100%', padding:'14px', borderRadius:'10px', background:'#151515', border:'1px solid #2a2a2a', color:'#fff', outline:'none', transition:'border 0.2s', fontSize:'14px' },
  btnGold: { background:'linear-gradient(135deg, #D4AF37 0%, #B8972E 100%)', color:'#000', padding:'14px', borderRadius:'10px', border:'none', fontWeight:'bold', cursor:'pointer', width:'100%', display:'flex', justifyContent:'center', alignItems:'center', gap:10, fontSize:'15px' },
  btnGoldSmall: { background:'#D4AF37', color:'#000', padding:'10px 18px', borderRadius:'8px', fontWeight:'bold', border:'none', cursor:'pointer', display:'flex', gap:'8px', alignItems:'center', fontSize:'13px' },
  btnRoleActive: { flex:1, background:'#D4AF3720', color:'#D4AF37', border:'1px solid #D4AF37', padding:'12px', borderRadius:'8px', fontSize:'13px', fontWeight:'bold', cursor:'pointer' },
  btnRole: { flex:1, background:'#151515', color:'#888', border:'1px solid #222', padding:'12px', borderRadius:'8px', fontSize:'13px', cursor:'pointer' },
  toggleAuth: { textAlign:'center', color:'#888', marginTop:'15px', cursor:'pointer', fontSize:'14px' },
  btnEntry: { background: '#4ade8020', color: '#4ade80', border: '1px solid #4ade80', padding: '10px 18px', borderRadius: '8px', cursor:'pointer', fontWeight:'bold', fontSize:'13px' },
  btnExit: { background: '#f8717120', color: '#f87171', border: '1px solid #f87171', padding: '10px 18px', borderRadius: '8px', cursor:'pointer', fontWeight:'bold', fontSize:'13px' },
  statsGrid: { display:'flex', gap:'20px', flexWrap:'wrap' },
  cardGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px' },
  itemCard: { background:'#111', borderRadius:'15px', border:'1px solid #222', display:'flex', flexDirection:'column', overflow:'hidden' },
  inputEdit: { background:'transparent', border:'none', color:'#fff', width:'100%', fontSize:'18px', fontWeight:'bold', outline:'none', marginBottom:'5px' },
  areaEdit: { background:'transparent', border:'none', color:'#aaa', width:'100%', fontSize:'14px', outline:'none', resize:'none', minHeight:'50px' },
  btnOutlineAction: { background:'transparent', color:'#D4AF37', border:'1px solid #D4AF37', padding:'10px', borderRadius:'8px', width:'100%', marginTop:'15px', cursor:'pointer', fontWeight:'bold', fontSize:'13px' },
  btnGoldAction: { background:'#D4AF37', color:'#000', border:'none', padding:'12px', borderRadius:'8px', width:'100%', marginTop:'15px', cursor:'pointer', fontWeight:'bold', fontSize:'13px' },
  btnLogout: { background: 'transparent', color: '#f87171', border: 'none', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', cursor:'pointer', padding:'15px', fontWeight:'bold' },
  table: { width:'100%', borderCollapse:'collapse', textAlign:'left', background:'#111', borderRadius:15, overflow:'hidden', marginTop:15 },
  modalOverlay: { position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.85)', backdropFilter:'blur(5px)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:100 },
  modal: { background:'#111', padding:35, borderRadius:20, width:'100%', maxWidth:400, textAlign:'center', border:'1px solid #333', boxShadow:'0 25px 50px rgba(0,0,0,0.5)' },
  payGrid: { display:'grid', gridTemplateColumns:'1fr', gap:12, marginTop:25 },
  payBtn: { padding:15, borderRadius:10, border:'1px solid #333', background:'#151515', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontSize:'15px', fontWeight:'500' },
  btnCancel: { marginTop:20, color:'#888', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', fontSize:'14px' },
  toast: { position:'fixed', bottom:30, right:30, background:'#D4AF37', color:'#000', padding:'15px 25px', borderRadius:10, fontWeight:'bold', zIndex:1000 },
  clientHomeCard: { flex:1, minWidth:280, background:'#111', padding:25, borderRadius:15, border:'1px solid #222' },
  cardTitle: { marginTop:0, color:'#D4AF37', display:'flex', alignItems:'center', gap:8 }
};

export default App;