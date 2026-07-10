"use client";

import { useState } from "react";

type Civilite = "M" | "MME";
type TypeDemande = "VISITE" | "RAPPEL" | "PHOTOS";

type Disponibilite = {
  id: string;
  jour: string;
  heure: number;
  minute: number;
};

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const HEURES = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export default function Home() {
  const [civilite, setCivilite] = useState<Civilite>("MME");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [typeDemande, setTypeDemande] = useState<TypeDemande>("VISITE");
  const [message, setMessage] = useState("");

  const [jour, setJour] = useState(JOURS[0]);
  const [heure, setHeure] = useState(HEURES[7]);
  const [minute, setMinute] = useState(MINUTES[0]);
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);

  const [envoi, setEnvoi] = useState<"idle" | "loading" | "success" | "error">("idle");

  function ajouterDispo() {
    setDisponibilites((prev) => [
      ...prev,
      { id: crypto.randomUUID(), jour, heure, minute },
    ]);
  }

  function supprimerDispo(id: string) {
    setDisponibilites((prev) => prev.filter((d) => d.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi("loading");
    try {
      const res = await fetch("/api/formulaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          civilite,
          nom,
          prenom,
          email,
          telephone,
          typeDemande,
          message,
          disponibilites: disponibilites.map(({ jour, heure, minute }) => ({
            jour,
            heure,
            minute,
          })),
        }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setEnvoi("success");
    } catch (err) {
      setEnvoi("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-900 p-6">
      <div
        className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl"
        style={{
          backgroundImage: "url('/interieur.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <form onSubmit={handleSubmit} className="relative z-10 p-10 text-white">
          <h1 className="text-3xl font-bold mb-8">CONTACTEZ L&apos;AGENCE</h1>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Colonne gauche : coordonnées + disponibilités */}
            <div>
              <h2 className="font-bold tracking-wide mb-3">VOS COORDONNÉES</h2>

              <div className="flex gap-6 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={civilite === "MME"}
                    onChange={() => setCivilite("MME")}
                  />
                  Mme
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={civilite === "M"}
                    onChange={() => setCivilite("M")}
                  />
                  M
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  className="rounded-full px-4 py-2 text-neutral-800 placeholder-neutral-400"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
                <input
                  className="rounded-full px-4 py-2 text-neutral-800 placeholder-neutral-400"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>

              <input
                type="email"
                className="w-full rounded-full px-4 py-2 mb-3 text-neutral-800 placeholder-neutral-400"
                placeholder="Adresse mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="w-full rounded-full px-4 py-2 mb-6 text-neutral-800 placeholder-neutral-400"
                placeholder="Téléphone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
              />

              <h2 className="font-bold tracking-wide mb-3">
                DISPONIBILITÉS POUR UNE VISITE
              </h2>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <select
                  className="rounded-full px-3 py-2 text-neutral-800"
                  value={jour}
                  onChange={(e) => setJour(e.target.value)}
                >
                  {JOURS.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-full px-3 py-2 text-neutral-800"
                  value={heure}
                  onChange={(e) => setHeure(Number(e.target.value))}
                >
                  {HEURES.map((h) => (
                    <option key={h} value={h}>
                      {h}h
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-full px-3 py-2 text-neutral-800"
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {m}m
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={ajouterDispo}
                  className="bg-purple-800 hover:bg-purple-900 text-white rounded-full px-4 py-2 text-sm font-semibold"
                >
                  AJOUTER DISPO
                </button>
              </div>

              <ul className="flex flex-col gap-2">
                {disponibilites.map((d) => (
                  <li
                    key={d.id}
                    className="flex justify-between items-center bg-neutral-200/90 text-neutral-800 rounded-full px-4 py-1 max-w-xs"
                  >
                    <span>
                      {d.jour} à {d.heure}h{String(d.minute).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => supprimerDispo(d.id)}
                      className="ml-3 font-bold"
                      aria-label="Supprimer cette disponibilité"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne droite : demande + message */}
            <div className="flex flex-col">
              <h2 className="font-bold tracking-wide mb-3">VOTRE MESSAGE</h2>

              <div className="flex flex-wrap gap-6 mb-3">
                {[
                  { value: "VISITE", label: "Demande de visite" },
                  { value: "RAPPEL", label: "Être rappelé.e" },
                  { value: "PHOTOS", label: "Plus de photos" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={typeDemande === opt.value}
                      onChange={() => setTypeDemande(opt.value as TypeDemande)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <textarea
                className="flex-1 min-h-[180px] rounded-2xl p-4 text-neutral-800 placeholder-neutral-400 mb-6"
                placeholder="Votre message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                type="submit"
                disabled={envoi === "loading"}
                className="self-end bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-3 font-bold disabled:opacity-60"
              >
                {envoi === "loading" ? "ENVOI..." : "ENVOYER"}
              </button>

              {envoi === "success" && (
                <p className="text-green-300 mt-3 self-end">Message envoyé !</p>
              )}
              {envoi === "error" && (
                <p className="text-red-300 mt-3 self-end">Erreur, réessaie.</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}