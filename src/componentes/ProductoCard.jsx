import React from 'react';
import styles from "../styles/ProductoCard.module.css";

const ProductoCard = ({ producto, onAgregar }) => {
  const { nombre, descripcion, precio, imagen } = producto;

  return (
    <div className={styles.productoCard}>
      <div className={styles.info}>
        <h3>{nombre}</h3>
        <p>{descripcion}</p>
        <p className={styles.precio}>${precio}</p>
        <button onClick={() => onAgregar(producto)} className={styles.btnAgregar}>
          Agregar
        </button>
      </div>
      <img src={imagen} alt={nombre} className={styles.productoImagen} />
    </div>

  );
};

export default ProductoCard;
