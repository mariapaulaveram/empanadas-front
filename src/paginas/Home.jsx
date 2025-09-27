import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductoCard from '../componentes/ProductoCard';
import CarritoItem from '../componentes/CarritoItem';
import CarritoResumen from '../componentes/CarritoResumen';
import FormularioPedido from '../componentes/FormularioPedido';
import EntregaSelector from '../componentes/EntregaSelector';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState('domicilio'); // 'domicilio' o 'retiro'

  useEffect(() => {
    axios.get('http://localhost:3000/api/productos')
      .then((res) => {
        console.log('📦 Respuesta del backend:', res.data);
        setProductos(Array.isArray(res.data) ? res.data : [res.data]);
      })
      .catch((error) => console.error('Error al cargar productos:', error));
  }, []);



  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      console.log('🛒 Carrito actualizado:', [...carrito, producto]);
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const calcularSubtotal = () =>
    carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const costoEnvio = 0;
  const calcularTotal = () => calcularSubtotal() + costoEnvio;

  const handleConfirmarPedido = (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));

    const cliente = {
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
      comentarios: datos.comentarios,
      formaPago: datos.formaPago
    };

    if (tipoEntrega === 'domicilio') {
      cliente.direccion = datos.direccion;
      cliente.pisoDepto = datos.pisoDepto;
    }

    const pedido = {
      tipoEntrega, // 👈 se guarda la opción elegida
      cliente,
      productos: carrito.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precioUnitario: p.precio,
        subtotal: p.precio * p.cantidad
      })),
      subtotal: calcularSubtotal(),
      envio: costoEnvio,
      total: calcularTotal(),
      fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
      estado: "pendiente"
    };


    console.log("🧾 Pedido que se envía:", pedido);

    axios.post("http://localhost:3000/api/pedidos", pedido)
      .then((res) => {
        console.log("✅ Pedido confirmado:", res.data);
        alert("¡Pedido confirmado!");
        setCarrito([]);
        setMostrarFormulario(false);
      })
      .catch((err) => {
        console.error("❌ Error al confirmar pedido:", err);
        alert("Hubo un error al confirmar el pedido. Revisá la consola.");
      });
  };


  return (
    <>
      <EntregaSelector tipoEntrega={tipoEntrega} setTipoEntrega={setTipoEntrega} />

      <div className={styles.layout}>
        <div className={styles.catalogo}>
          <h2>Menú de Empanadas</h2>
          <div className={styles.grid}>
            {productos.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </div>
        </div>

        <aside className={styles.carrito}>
          <h3>Tu pedido</h3>
          {carrito.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            <>
              <ul>
                {carrito.map((item) => (
                  <CarritoItem
                    key={item.id}
                    item={item}
                    onEditar={(id) => {
                      const nuevoCarrito = carrito.map((p) =>
                        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
                      );
                      setCarrito(nuevoCarrito);
                    }}
                    onEliminar={(id) =>
                      setCarrito((prev) => prev.filter((p) => p.id !== id))
                    }
                  />
                ))}
              </ul>
              <CarritoResumen
                subtotal={calcularSubtotal()}
                envio={costoEnvio}
                total={calcularTotal()}
                onContinuar={() => setMostrarFormulario(true)}
              />
            </>
          )}
        </aside>
      </div>

      {mostrarFormulario && (
        <FormularioPedido
          tipoEntrega={tipoEntrega}
          onClose={() => setMostrarFormulario(false)}
          onSubmit={handleConfirmarPedido}
        />
      )}
    </>

  );

};

export default Home;

