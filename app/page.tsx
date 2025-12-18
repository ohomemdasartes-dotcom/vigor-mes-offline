"use client";

import { useEffect, useState } from "react";

// 🔑 SUPABASE
const supabase = createClient(
  "https://eizqadazgtljmqtgnqja.supabase.co",
  "sb_publishable_WGH8uNf2UsrN6u2rVKDugA_7wCCPaXq"
);

// 🔴 ALERTA DE PARADAS EM ABERTO
function ParadasEmAberto({ dados }: { dados: any[] }) {
  const abertas = dados.filter((p) => !p.hora_fim);
  if (abertas.length === 0) return null;

  return (
    <div style={{ background: "#fee2e2", border: "1px solid #dc2626", padding: 16, borderRadius: 8, marginBottom: 20 }}>
      <strong style={{ color: "#b91c1c" }}>⚠ Paradas em aberto</strong>
      <ul>
        {abertas.map((p) => (
          <li key={p.id}>
            {p.setor} - {p.maquina} (desde{" "}
            {new Date(p.hora_inicio).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Page() {
  const [dados, setDados] = useState<any[]>([]);
  const [form, setForm] = useState({
    setor: "",
    maquina: "",
    turno: "1º",
    codigo: "",
    descricao: "",
    inicioManual: "",
    fimManual: "",
  });

  async function carregar() {
    const { data } = await supabase
      .from("eventos_maquina")
      .select("*")
      .order("hora_inicio", { ascending: false });
    setDados(data || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function iniciarParada() {
    await supabase.from("eventos_maquina").insert({
      setor: form.setor,
      maquina: form.maquina,
      turno: form.turno,
      tipo_evento: form.codigo,
      motivo: form.descricao,
      hora_inicio: form.inicioManual || new Date().toISOString(),
    });
    carregar();
  }

  async function finalizarParada() {
    const aberta = dados.find(
      (d) => d.maquina === form.maquina && !d.hora_fim
    );
    if (!aberta) return;

    await supabase
      .from("eventos_maquina")
      .update({
        hora_fim: form.fimManual || new Date().toISOString(),
      })
      .eq("id", aberta.id);

    carregar();
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial" }}>
      <h1 style={{ color: "#1e3a8a" }}>
        VIGOR Alimentos - SCS | Registro de Paradas – MES Offline
      </h1>

      <ParadasEmAberto dados={dados} />

      <h2>Registro de Parada</h2>

      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="Setor" onChange={(e) => setForm({ ...form, setor: e.target.value })} />
        <input placeholder="Máquina" onChange={(e) => setForm({ ...form, maquina: e.target.value })} />

        <select onChange={(e) => setForm({ ...form, turno: e.target.value })}>
          <option>1º</option>
          <option>2º</option>
          <option>3º</option>
        </select>

        <input placeholder="Código da parada (número)" onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
        <input placeholder="Descrição" onChange={(e) => setForm({ ...form, descricao: e.target.value })} />

        <label>Hora início (opcional)</label>
        <input type="datetime-local" onChange={(e) => setForm({ ...form, inicioManual: e.target.value })} />

        <label>Hora fim (opcional)</label>
        <input type="datetime-local" onChange={(e) => setForm({ ...form, fimManual: e.target.value })} />

        <button onClick={iniciarParada}>▶ Iniciar Parada</button>
        <button onClick={finalizarParada}>⏹ Finalizar Parada</button>
      </div>

      <h2 style={{ marginTop: 40 }}>Relatório</h2>
      <table border={1} cellPadding={6} width="100%">
        <thead>
          <tr>
            <th>Setor</th>
            <th>Máquina</th>
            <th>Turno</th>
            <th>Código</th>
            <th>Início</th>
            <th>Fim</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((d) => (
            <tr key={d.id} style={{ background: d.hora_fim ? "white" : "#fee2e2" }}>
              <td>{d.setor}</td>
              <td>{d.maquina}</td>
              <td>{d.turno}</td>
              <td>{d.tipo_evento}</td>
              <td>{new Date(d.hora_inicio).toLocaleString()}</td>
              <td>{d.hora_fim ? new Date(d.hora_fim).toLocaleString() : "EM ABERTO"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
