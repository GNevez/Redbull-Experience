import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070b12",
        }}
      >
        <p
          style={{
            color: "#3a4356",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontSize: "0.85rem",
          }}
        >
          Próxima seção
        </p>
      </section>
    </main>
  );
}
