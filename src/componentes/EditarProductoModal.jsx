import React from 'react';
import styles from '../styles/EditarProductoModal.module.css';

const EditarProductoModal = ({ producto, cantidad, setCantidad, onGuardar, onCancelar, comentario,
setComentario
 }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <img src={producto.imagen} alt={producto.nombre} className={styles.imagen} />
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>

        <div className={styles.controles}>
          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
          <input
            type="number"
            min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                  />
                  <button onClick={() => setCantidad(cantidad + 1)}>+</button>
              </div>
              <textarea
                  placeholder="Comentario (opcional)"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className={styles.textarea}
              />

              <div className={styles.botones}>
                  <button onClick={onGuardar}>Guardar</button>
                  <button onClick={onCancelar}>Cancelar</button>
              </div>
      </div>
    </div>
  );
};

export default EditarProductoModal;
