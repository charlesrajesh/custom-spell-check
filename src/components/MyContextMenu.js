import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/ContextMenu.scss';

function MyContextMenu({ targetId, options, onOptionSelect }) {
  const contextRef = useRef(null);
  const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });

  useEffect(() => {
    const contextMenuEventHandler = (event) => {
      const targetElement = document.getElementById(targetId);
      if (targetElement && targetElement.contains(event.target)) {
        event.preventDefault();
        setContextData({ visible: true, posX: event.clientX, posY: event.clientY });
      } else if (contextRef.current && !contextRef.current.contains(event.target)) {
        setContextData({ ...contextData, visible: false });
      }
    };

    const offClickHandler = (event) => {
      if (contextRef.current && !contextRef.current.contains(event.target)) {
        setContextData({ ...contextData, visible: false });
      }
    };

    document.addEventListener('contextmenu', contextMenuEventHandler);
    document.addEventListener('click', offClickHandler);
    return () => {
      document.removeEventListener('contextmenu', contextMenuEventHandler);
      document.removeEventListener('click', offClickHandler);
    };
  }, [contextData, targetId]);

  useLayoutEffect(() => {
    if (contextData.posX + Number(contextRef.current?.offsetWidth) > window.innerWidth) {
      setContextData({
        ...contextData,
        posX: contextData.posX - Number(contextRef.current?.offsetWidth),
      });
    }
    if (contextData.posY + Number(contextRef.current?.offsetHeight) > window.innerHeight) {
      setContextData({
        ...contextData,
        posY: contextData.posY - Number(contextRef.current?.offsetHeight),
      });
    }
  }, [contextData]);

  return (
    <div
      ref={contextRef}
      className="contextMenu"
      style={{
        display: `${contextData.visible ? 'block' : 'none'}`,
        left: contextData.posX,
        top: contextData.posY,
      }}
    >
      <div className="optionsList">
        {options.map((option) => (
          // eslint-disable-next-line
          <li key={option} onClick={() => onOptionSelect(option)} className="optionListItem">
            {option}
          </li>
        ))}
      </div>
    </div>
  );
}

MyContextMenu.propTypes = {
  targetId: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOptionSelect: PropTypes.func.isRequired,
};

export default MyContextMenu;
