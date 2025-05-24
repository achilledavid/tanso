import { Fragment } from "react";
import style from "./home.module.scss"
import SignInButton from "@/components/sign-in-button";
import Header from "@/components/header/header";
import { AuthButton } from "@/components/auth-button";
import { Grid3X3, Music, Share2 } from "lucide-react";
import StepCard from "@/components/landing-page/stepCard/StepCard";
import FeatureCard  from "@/components/landing-page/featureCard/FeatureCard";
import Herobanner from "@/components/landing-page/herobanner/Herobanner";
import Informations from "@/components/landing-page/informations/Informations";

export default function Home() {

  return (
    <Fragment>
      <Header landing>
        <AuthButton variants={{ size: "sm" }} />
      </Header>
      <main className={style.container}>
        <Herobanner />

        <Informations />


        <section className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[Deezer]">
              Créez comme un pro, <span className="text-[#a238ff]">sans l&apos;être</span>
            </h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Tanso combine puissance et simplicité pour vous permettre de créer de la musique professionnelle sans
              courbe d&apos;apprentissage abrupte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Grid3X3 size={24} />}
              title="Interface à Pads Intuitive"
              description="Créez des rythmes et mélodies avec notre grille de pads réactive qui offre une expérience naturelle"
            />
            <FeatureCard
              icon={<Music size={24} />}
              title="Bibliothèque Sonore Pro"
              description="Accédez à des milliers d'échantillons et de sons de haute qualité pour alimenter votre créativité"
            />
            <FeatureCard
              icon={<Share2 size={24} />}
              title="Partage Instantané"
              description="Partagez vos créations directement sur les plateformes sociales ou avec d'autres utilisateurs Tanso"
            />
          </div>
        </section>

        <section className="w-full bg-gradient-to-r from-[#454545] to-[#1a1a1a] rounded-2xl p-8 md:p-12">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[Deezer]">Prêt à créer votre prochain hit ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de musiciens qui créent déjà des morceaux incroyables avec Tanso
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <SignInButton>Commencer gratuitement</SignInButton>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>En version Beta actuellement</span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[Deezer]">Comment ça marche</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Trois étapes simples pour passer de l&apos;idée au morceau fini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Choisissez Vos Sons"
              description="Parcourez notre vaste bibliothèque d'échantillons, d'instruments et de boucles pour trouver votre son parfait"
            />
            <StepCard
              number="02"
              title="Créez Avec Les Pads"
              description="Utilisez notre interface intuitive à pads pour composer des rythmes, des mélodies et des pistes complètes facilement"
            />
            <StepCard
              number="03"
              title="Peaufinez & Partagez"
              description="Ajoutez des effets, mixez votre piste et partagez votre création avec le monde entier"
            />
          </div>
        </section>
      </main>
    </Fragment>
  );
}