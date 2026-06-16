import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/staticPages.css";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="static-page-layout fade-in">
      <div className="static-container">
        <header className="static-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Voltar para a Estação
          </button>
          <h1>Sobre o Cookiestation</h1>
          <p className="subtitle">
            Um espaço dedicado à escrita, leitura e construção de mundos.
          </p>
        </header>

        <main className="static-content">
          <section className="about-hero">
            <p>
              O <strong>Cookiestation</strong> é uma plataforma desenvolvida para
              escritores e leitores que valorizam a profundidade da narrativa.
              Em um ambiente digital cada vez mais acelerado, propomos uma
              experiência mais contemplativa, onde ideias podem evoluir com
              clareza, consistência e propósito.
            </p>
          </section>

          <section>
            <h2>Nossa Essência</h2>
            <p>
              Acreditamos que boas histórias precisam de espaço para crescer.
              Por isso, o Cookiestation foi projetado com foco na
              <strong> experiência de escrita</strong> e na
              <strong> qualidade da leitura</strong>, reduzindo distrações e
              priorizando o que realmente importa: o conteúdo.
            </p>
            <p>
              Nosso objetivo é oferecer um ambiente equilibrado entre
              funcionalidade técnica e sensibilidade criativa, permitindo que
              autores desenvolvam suas ideias com liberdade e que leitores
              encontrem narrativas envolventes com facilidade.
            </p>
          </section>

          <section className="about-features-grid">
            <div className="feature-item">
              <h3>Escrita Focada</h3>
              <p>
                Ferramentas pensadas para proporcionar fluidez criativa, sem
                interferências desnecessárias no processo de criação.
              </p>
            </div>
            <div className="feature-item">
              <h3>Ambiente Confiável</h3>
              <p>
                Uma comunidade baseada em respeito, colaboração e incentivo ao
                desenvolvimento contínuo dos autores.
              </p>
            </div>
            <div className="feature-item">
              <h3>Design Funcional</h3>
              <p>
                Interface moderna e cuidadosamente construída para oferecer
                conforto visual e uma experiência consistente em longas sessões
                de leitura e escrita.
              </p>
            </div>
          </section>

          <section>
            <h2>Visão de Futuro</h2>
            <p>
              O Cookiestation está em constante evolução. Nosso propósito é
              expandir a plataforma para além da escrita tradicional,
              incorporando recursos voltados a narrativas interativas, RPGs de
              texto e novas formas de contar histórias.
            </p>
            <p>
              Trabalhamos continuamente para transformar a plataforma em um
              ecossistema completo para criadores, mantendo sempre o compromisso
              com qualidade, simplicidade e inovação.
            </p>
          </section>

          <div className="static-footer-note about-footer">
            <p>Fique à vontade para explorar, criar e compartilhar.</p>
            <span>Desenvolvido por Vitor Alves • 2026</span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;