import "./globals.css";

export const metadata = {
  title: "Iglesia Reformada Tupahue",
  description: "Iglesia Reformada en Puerto Montt, Los Lagos. Somos una iglesia formada por personas que expresan la misma fe y fueron llamados a ser parte de una nueva familia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
