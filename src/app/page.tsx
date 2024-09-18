import LandingPage from "@/components/landingpage/LandingPage";
import Footer from "@/components/ui/Footer/Footer";
import Navbar from "@/components/ui/navbar/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if(!session){
    redirect('/login')
  }
  return (
    <>
    <Navbar />
    <LandingPage />
    <Footer />
    </>
  );
}