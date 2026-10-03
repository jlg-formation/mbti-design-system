import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { DatePicker } from '../components/ui/DatePicker';
import { Modal } from '../components/ui/Modal';
import { RadioGroup } from '../components/ui/RadioGroup';
import { Select } from '../components/ui/Select';
import { Slider } from '../components/ui/Slider';
import { Switch } from '../components/ui/Switch';
import { Tabs } from '../components/ui/Tabs';
import { TextInput } from '../components/ui/TextInput';
import { DemoCard, StateItem } from './DemoCard';

const noop = () => {};

function ButtonDemo() {
  return (
    <DemoCard
      index={1}
      title="Bouton"
      description="Trois niveaux d’importance : primaire, secondaire et discret."
      states={
        <>
          <StateItem label="Survol">
            <Button forceState="hover">Survolé</Button>
          </StateItem>
          <StateItem label="Focus">
            <Button variant="secondary" forceState="focus">
              Focus clavier
            </Button>
          </StateItem>
          <StateItem label="Désactivé">
            <Button disabled>Indisponible</Button>
          </StateItem>
        </>
      }
    >
      <div className="demo-row">
        <Button>Commencer</Button>
        <Button variant="secondary">En savoir plus</Button>
        <Button variant="ghost">Plus tard</Button>
      </div>
    </DemoCard>
  );
}

function InputDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('camille@exemple');
  const emailError = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Adresse e-mail incomplète.' : undefined;
  return (
    <DemoCard
      index={2}
      title="Champ de texte"
      description="Avec libellé, texte d’aide et message d’erreur."
      states={
        <>
          <StateItem label="Survol">
            <TextInput label="Ville" placeholder="Lyon" forceState="hover" />
          </StateItem>
          <StateItem label="Focus">
            <TextInput label="Ville" placeholder="Lyon" forceState="focus" />
          </StateItem>
          <StateItem label="Désactivé">
            <TextInput label="Ville" placeholder="Lyon" disabled />
          </StateItem>
        </>
      }
    >
      <TextInput
        label="Prénom"
        placeholder="Camille"
        hint="Tel qu’il apparaîtra sur votre profil."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput label="E-mail" type="email" value={email} error={emailError} onChange={(e) => setEmail(e.target.value)} />
    </DemoCard>
  );
}

function CheckboxDemo() {
  const [items, setItems] = useState({ news: true, tips: false, events: true });
  const toggle = (k: keyof typeof items) => setItems((s) => ({ ...s, [k]: !s[k] }));
  return (
    <DemoCard
      index={3}
      title="Case à cocher"
      description="Plusieurs choix indépendants."
      states={
        <>
          <StateItem label="Survol">
            <Checkbox label="Option" forceState="hover" checked={false} onChange={noop} />
          </StateItem>
          <StateItem label="Focus">
            <Checkbox label="Option" forceState="focus" checked onChange={noop} />
          </StateItem>
          <StateItem label="Désactivé">
            <Checkbox label="Option" disabled checked onChange={noop} />
          </StateItem>
        </>
      }
    >
      <Checkbox label="Recevoir la lettre d’information" checked={items.news} onChange={() => toggle('news')} />
      <Checkbox label="Astuces et tutoriels" checked={items.tips} onChange={() => toggle('tips')} />
      <Checkbox label="Invitations aux événements" checked={items.events} onChange={() => toggle('events')} />
    </DemoCard>
  );
}

function RadioDemo() {
  const [plan, setPlan] = useState('team');
  const options = [
    { value: 'solo', label: 'Solo — pour moi seul' },
    { value: 'team', label: 'Équipe — jusqu’à 10 personnes' },
    { value: 'org', label: 'Organisation — sans limite' },
  ];
  return (
    <DemoCard
      index={4}
      title="Groupe de boutons radio"
      description="Un seul choix possible parmi plusieurs."
      states={
        <>
          <StateItem label="Survol">
            <RadioGroup legend="Survol" hideLegend options={[{ value: 'a', label: 'Option' }]} value={undefined} onChange={noop} forceState="hover" />
          </StateItem>
          <StateItem label="Focus">
            <RadioGroup legend="Focus" hideLegend options={[{ value: 'a', label: 'Option' }]} value="a" onChange={noop} forceState="focus" />
          </StateItem>
          <StateItem label="Désactivé">
            <RadioGroup legend="Désactivé" hideLegend options={[{ value: 'a', label: 'Option' }]} value="a" onChange={noop} disabled />
          </StateItem>
        </>
      }
    >
      <RadioGroup legend="Formule" options={options} value={plan} onChange={setPlan} />
    </DemoCard>
  );
}

function SwitchDemo() {
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(false);
  return (
    <DemoCard
      index={5}
      title="Interrupteur"
      description="Active ou désactive un réglage immédiatement."
      states={
        <>
          <StateItem label="Survol">
            <Switch label="Réglage" checked={false} onChange={noop} forceState="hover" />
          </StateItem>
          <StateItem label="Focus">
            <Switch label="Réglage" checked onChange={noop} forceState="focus" />
          </StateItem>
          <StateItem label="Désactivé">
            <Switch label="Réglage" checked onChange={noop} disabled />
          </StateItem>
        </>
      }
    >
      <Switch label="Notifications" checked={notif} onChange={setNotif} />
      <Switch label="Sons de l’interface" checked={sound} onChange={setSound} />
    </DemoCard>
  );
}

const FRUITS = ['Abricot', 'Banane', 'Cerise', 'Figue', 'Framboise', 'Kiwi', 'Mangue', 'Myrtille', 'Pêche', 'Poire'].map(
  (f) => ({ value: f.toLowerCase(), label: f }),
);

function SelectDemo() {
  const [fruit, setFruit] = useState<string>();
  return (
    <DemoCard
      index={6}
      title="Liste déroulante"
      description="Choisir une valeur dans une liste, à la souris ou au clavier."
      states={
        <>
          <StateItem label="Survol">
            <Select label="Fruit" options={FRUITS} value="kiwi" onChange={noop} forceState="hover" />
          </StateItem>
          <StateItem label="Focus">
            <Select label="Fruit" options={FRUITS} value="kiwi" onChange={noop} forceState="focus" />
          </StateItem>
          <StateItem label="Désactivé">
            <Select label="Fruit" options={FRUITS} value="kiwi" onChange={noop} disabled />
          </StateItem>
        </>
      }
    >
      <Select label="Fruit préféré" options={FRUITS} value={fruit} onChange={setFruit} />
    </DemoCard>
  );
}

function DateDemo() {
  const [date, setDate] = useState<Date>();
  const sample = new Date(2026, 9, 14);
  return (
    <DemoCard
      index={7}
      title="Sélecteur de date"
      description="Un calendrier navigable au clavier (flèches, Page préc./suiv.)."
      states={
        <>
          <StateItem label="Survol">
            <DatePicker label="Date" value={sample} onChange={noop} forceState="hover" />
          </StateItem>
          <StateItem label="Focus">
            <DatePicker label="Date" value={sample} onChange={noop} forceState="focus" />
          </StateItem>
          <StateItem label="Désactivé">
            <DatePicker label="Date" value={sample} onChange={noop} disabled />
          </StateItem>
        </>
      }
    >
      <DatePicker label="Date du rendez-vous" value={date} onChange={setDate} />
    </DemoCard>
  );
}

function SliderDemo() {
  const [volume, setVolume] = useState(60);
  const [budget, setBudget] = useState(1200);
  return (
    <DemoCard
      index={8}
      title="Curseur"
      description="Régler une valeur continue sur une plage."
      states={
        <>
          <StateItem label="Survol">
            <Slider label="Valeur" value={40} onChange={noop} forceState="hover" />
          </StateItem>
          <StateItem label="Focus">
            <Slider label="Valeur" value={40} onChange={noop} forceState="focus" />
          </StateItem>
          <StateItem label="Désactivé">
            <Slider label="Valeur" value={40} onChange={noop} disabled />
          </StateItem>
        </>
      }
    >
      <Slider label="Volume" value={volume} onChange={setVolume} formatValue={(v) => `${v} %`} />
      <Slider
        label="Budget"
        value={budget}
        min={0}
        max={5000}
        step={50}
        onChange={setBudget}
        formatValue={(v) => `${v.toLocaleString('fr-FR')} €`}
      />
    </DemoCard>
  );
}

function TabsDemo() {
  const [tab, setTab] = useState('apercu');
  return (
    <DemoCard index={9} title="Onglets" description="Passer d’une vue à l’autre sans quitter la page.">
      <Tabs
        label="Détails du projet"
        value={tab}
        onChange={setTab}
        items={[
          {
            id: 'apercu',
            label: 'Aperçu',
            content: <p className="demo-text">Un design system unique, dix composants, seize personnalités.</p>,
          },
          {
            id: 'activite',
            label: 'Activité',
            content: <p className="demo-text">Trois personnes ont modifié ce projet aujourd’hui.</p>,
          },
          {
            id: 'reglages',
            label: 'Réglages',
            content: <p className="demo-text">Les réglages avancés arrivent bientôt.</p>,
          },
          { id: 'archives', label: 'Archives', content: null, disabled: true },
        ]}
      />
    </DemoCard>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoCard index={10} title="Fenêtre modale" description="Une boîte de dialogue qui demande une confirmation.">
      <div className="demo-row">
        <Button onClick={() => setOpen(true)}>Supprimer le projet…</Button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Supprimer le projet ?"
        description="Cette action est définitive : les fichiers et l’historique seront perdus."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} data-autofocus>
              Annuler
            </Button>
            <Button onClick={() => setOpen(false)}>Supprimer</Button>
          </>
        }
      />
    </DemoCard>
  );
}

export function DemoSections() {
  return (
    <div className="demo-grid">
      <ButtonDemo />
      <InputDemo />
      <CheckboxDemo />
      <RadioDemo />
      <SwitchDemo />
      <SelectDemo />
      <DateDemo />
      <SliderDemo />
      <TabsDemo />
      <ModalDemo />
    </div>
  );
}
