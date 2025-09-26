import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductoCard from '../componentes/ProductoCard';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);


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

    const pedido = {
      cliente: {
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        direccion: datos.direccion,
        pisoDepto: datos.pisoDepto,
        comentarios: datos.comentarios,
        formaPago: datos.formaPago
      },
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
                <li key={item.id}>
                  {item.nombre} <br />
                  (x{item.cantidad}) ${item.precio * item.cantidad}
                </li>
              ))}
            </ul>

            <div className={styles.resumen}>
              <h4>Resumen</h4>
              <p>Subtotal: ${calcularSubtotal()}</p>
              <p>Costo de envío: ${costoEnvio}</p>
              <p><strong>Total: ${calcularTotal()}</strong></p>
              <button className={styles.btnContinuar} onClick={() => setMostrarFormulario(true)}>
                Continuar pedido
              </button>
            </div>
          </>
        )}
      </aside>
      {mostrarFormulario && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalFormulario}>
            <h3>Datos generales</h3>
            <form onSubmit={handleConfirmarPedido}>
              <label>
                Nombre y apellido
                <input type="text" name="nombre" placeholder="Juan Pérez" required />
              </label>

              <label>
                Correo electrónico
                <input type="email" name="email" placeholder="ejemplo@gmail.com" required />
              </label>

              <label>
                Teléfono
                <input type="tel" name="telefono" placeholder="011 15-2345-6789" required />
              </label>

              <label>
                Dirección
                <input type="text" name="direccion" placeholder="Av. Argentina 1234" required />
              </label>

              <label>
                Piso y departamento
                <input type="text" name="pisoDepto" placeholder="Ej: 1B" />
              </label>

              <label>
                Forma de pago
                <select name="formaPago" required>
                  <option value="">Seleccionar</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="mercadoPago">Mercado Pago</option>
                </select>
              </label>

              <label>
                Comentarios
                <textarea name="comentarios" placeholder="Algo que quieras aclarar..." rows="3" />
              </label>

              <div className={styles.modalBotones}>
                <button type="submit">Confirmar pedido</button>
                <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>

  );

};

export default Home;

