import { MorphCaps } from './components/MorphCaps';
import { DemoSections } from './sections/DemoSections';
import { MbtiPanel } from './panel/MbtiPanel';
import './App.css';

export function App() {
  return (
    <>
      <div className="decor" aria-hidden="true">
        <span className="decor__blob decor__blob--1" />
        <span className="decor__blob decor__blob--2" />
        <span className="decor__blob decor__blob--3" />
        <span className="decor__pattern" />
      </div>
      <div className="texture" aria-hidden="true">
        <span className="texture__grid" />
        <span className="texture__grain" />
      </div>

      <div className="app">
        <main className="page">
          <header className="intro">
            <p className="intro__kicker">MBTI Design System</p>
            <h1 className="intro__title">
              <MorphCaps>Un design system qui change de personnalité</MorphCaps>
            </h1>
            <p className="intro__text">
              Le MBTI est un modèle de personnalité populaire qui décrit chacun selon 4 axes : d’où vient notre
              énergie, comment on perçoit le monde, comment on décide, et comment on s’organise. Ici, on imagine à
              quoi ressemblerait une interface pour chaque personnalité : bougez les curseurs à droite, et les
              10 composants ci-dessous se transforment en direct.
            </p>
            <p className="intro__note">
              Le MBTI est un modèle ludique, pas un outil scientifique ni un diagnostic. Les correspondances
              visuelles sont une interprétation créative.
            </p>
          </header>

          <DemoSections />

          <footer className="page__footer">
            <p>
              Tous les composants sont faits main et ne consomment que des variables CSS recalculées à chaque
              mouvement de curseur. Police : Recursive.
            </p>
          </footer>
        </main>
        <MbtiPanel />
      </div>

      <div className="small-screen" role="alert">
        <p className="small-screen__title">MBTI Design System</p>
        <p>Ce site est pensé pour un écran d’ordinateur. Ouvrez-le sur un écran plus large pour jouer avec les curseurs.</p>
      </div>
    </>
  );
}
