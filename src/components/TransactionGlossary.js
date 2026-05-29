import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import terms from "./data";
import withAutoLogout from "./withAutoLogout";
import "./TransactionGlossary.css";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const TransactionGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");

  const filteredTerms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return terms.filter((item) => {
      const matchesLetter = !selectedLetter || item.term.toLowerCase().startsWith(selectedLetter.toLowerCase());
      const matchesSearch =
        !query ||
        item.term.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesLetter && matchesSearch;
    });
  }, [searchTerm, selectedLetter]);

  const categoriesCount = new Set(terms.map((item) => item.category)).size;

  return (
    <div className="glossary-page">
      <section className="glossary-hero">
        <div>
          <p className="glossary-eyebrow">Transaction glossary</p>
          <h1>Banking terms, explained clearly.</h1>
          <p className="glossary-lede">
            Browse common ATM, account, credit, and payment terms without leaving your banking workspace.
          </p>
        </div>

        <div className="glossary-stats" aria-label="Glossary summary">
          <div>
            <strong>{terms.length}</strong>
            <span>Total terms</span>
          </div>
          <div>
            <strong>{categoriesCount}</strong>
            <span>Categories</span>
          </div>
        </div>
      </section>

      <section className="glossary-tools">
        <label className="glossary-search">
          <span>Search glossary</span>
          <input
            type="text"
            placeholder="Search a term or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

        <div className="glossary-filter">
          <button
            type="button"
            className={`glossary-letter ${selectedLetter === "" ? "is-selected" : ""}`}
            onClick={() => setSelectedLetter("")}
          >
            All
          </button>

          {alphabet.map((letter) => (
            <button
              type="button"
              key={letter}
              className={`glossary-letter ${selectedLetter === letter ? "is-selected" : ""}`}
              onClick={() => setSelectedLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </section>

      <div className="glossary-results-bar">
        <strong>{filteredTerms.length} results</strong>
        {(searchTerm || selectedLetter) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedLetter("");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredTerms.length > 0 ? (
        <section className="glossary-grid">
          {filteredTerms.map((item) => (
            <motion.article
              key={`${item.category}-${item.term}`}
              className="glossary-card"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <span className="glossary-category">{item.category}</span>
              <h2>{item.term}</h2>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </section>
      ) : (
        <section className="glossary-empty">
          <strong>No results found</strong>
          <p>Try a different search term or clear the selected letter.</p>
        </section>
      )}
    </div>
  );
};

export default withAutoLogout(TransactionGlossary);
