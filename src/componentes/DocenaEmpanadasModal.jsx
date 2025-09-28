import React, { useState } from 'react';
import styles from '../styles/DocenaEmpanadas.module.css';

const saboresDisponibles = [
  "Carne Frita",
  "Carne Horno",
  "Jamón y Queso Frita",
  "Jamón y Queso Horno",
  "Queso y Cebolla Horno",
  "Queso y Cebolla Frita",
  "Humita Horno"
];

const DocenaEmpanadasModal = ({ onAgregar, onCancelar, precioUnitario = 24800 }) => {
  const [cantidadDocenas, setCantidadDocenas] = useState(1);
  const [sabores, setSabores] = useState(
    saboresDisponibles.map(nombre => ({ nombre, cantidad: 0 }))
  );

  const totalSeleccionado = sabores.reduce((acc, s) => acc + s.cantidad, 0);
  const totalEsperado = cantidadDocenas * 12;

  const actualizarCantidad = (index, delta) => {
    setSabores(prev => {
      const nuevo = [...prev];
      const nuevaCantidad = nuevo[index].cantidad + delta;
      if (nuevaCantidad >= 0 && totalSeleccionado + delta <= totalEsperado) {
        nuevo[index].cantidad = nuevaCantidad;
      }
      return nuevo;
    });
  };

  const agregarAlPedido = () => {
    const detalle = sabores
      .filter(s => s.cantidad > 0)
      .map(s => `${s.cantidad} ${s.nombre}`)
      .join(', ');

        const producto = {
            id: 9, // si lo tenés en la base de datos
            nombre: "Docena de empanadas a elección",
            cantidad: cantidadDocenas,
            precio: precioUnitario,
            comentario: detalle
        };


        onAgregar(producto);
    };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Docena de empanadas a elección</h2>
        <p>Incluye yasgua</p>

        <label>Cantidad de docenas:</label>
        <input
          type="number"
          min={1}
          value={cantidadDocenas}
          onChange={e => {
            const nueva = parseInt(e.target.value);
            if (nueva >= 1) {
              setCantidadDocenas(nueva);
              setSabores(saboresDisponibles.map(nombre => ({ nombre, cantidad: 0 })));
            }
          }}
          className={styles.input}
        />

        <h3>Selecciona tus sabores</h3>
        <p>Selecciona entre {totalSeleccionado} / {totalEsperado} opciones</p>

        {sabores.map((sabor, index) => (
          <div key={sabor.nombre} className={styles.saborItem}>
            <span>{sabor.nombre}</span>
            <div>
              <button onClick={() => actualizarCantidad(index, -1)}>-</button>
              <span className={styles.contador}>{sabor.cantidad}</span>
              <button onClick={() => actualizarCantidad(index, 1)}>+</button>
            </div>
          </div>
        ))}

        {totalSeleccionado !== totalEsperado && (
          <p className={styles.error}>Debés seleccionar exactamente {totalEsperado} empanadas</p>
        )}

        <button
          disabled={totalSeleccionado !== totalEsperado}
          onClick={agregarAlPedido}
          className={styles.confirmar}
        >
          Agregar al pedido
        </button>

        <button onClick={onCancelar} className={styles.cancelar}>Cancelar</button>
      </div>
    </div>
  );
};

export default DocenaEmpanadasModal;
