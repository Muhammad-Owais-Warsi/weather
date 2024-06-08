import {NextUIProvider} from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import CardBox from "./components/card";
import { Toaster } from "sonner";

function App() {
  

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
      <Toaster richColors position="top-center"/>
      <CardBox/>
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default App
