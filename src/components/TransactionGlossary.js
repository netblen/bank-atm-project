import React, { useState } from "react";
import terms from "./data";
import withAutoLogout from './withAutoLogout';
import { motion } from "framer-motion"; 
import "./TransactionGlossary.css";

const TransactionGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");

  // Obtener las letras del alfabeto
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Filtrar los términos por la letra seleccionada o por la búsqueda
  const filteredTerms = terms.filter((item) => {
    const termStartsWithSelectedLetter =
      selectedLetter === "" || item.term.toLowerCase().startsWith(selectedLetter.toLowerCase());
    const termMatchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return termStartsWithSelectedLetter && termMatchesSearch;
  });

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
  };

  // Función para manejar la selección de letras
  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
  };

  return (
    <div className="container">
      <h1 className="title">Transaction Glossary</h1>

      <input
        type="text"
        placeholder="Search for a term..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="alphabet-index">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={`alphabet-button ${selectedLetter === letter ? "selected" : ""}`}
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
        <button
          className={`alphabet-button ${selectedLetter === "" ? "selected" : ""}`}
          onClick={() => handleLetterClick("")}
        >
          All
        </button>
      </div>

      {filteredTerms.length > 0 ? (
        <div className="terms-container">
          {filteredTerms.map((item, index) => (
            <motion.div
              key={index}
              className="term"
              whileHover={{
                y: -10, // Eleva el box al pasar el cursor
                backgroundColor: "#f0f0f0", // Cambia el color de fondo al pasar el cursor
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" // Agrega una sombra suave
              }}
              transition={{
                type: "spring",
                stiffness: 300, // Controla la rigidez de la animación
                damping: 20, // Controla la suavidad
              }}
            >
              <h3 className="term-title">{item.term}</h3>
              <p className="term-description">{item.description}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="no-results">No results found. Try a different search term.</p>
      )}
    </div>
  );
};

export default withAutoLogout(TransactionGlossary);
