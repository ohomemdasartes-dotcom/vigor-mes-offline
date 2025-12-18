'use client'

import { useState } from 'react'

type Parada = {
  id: number
  setor: string
  maquina: string
  turno: string
  codigo: string
  descricao: string
  inicio: string
  fim?: string
}

export default function Page() {
  const [paradas, setParadas] = useState<Parada[]>([])
  const [form, setForm] = useState({
    setor: '',
    maquina: '',
    turno: '1º',
    codigo: '',
    descricao: '',
    inicioManual: '',
    fimManual: '',
  })

  function iniciarParada() {
    const nova: Parada = {
      id: Date.now(),
      setor: form.setor,
      maquina: form.maquina,
      turno: form.turno,
      codigo: form.codigo,
      descricao: form.descricao,
      inicio: form.inicioManual || new Date().toLocaleString(),
    }

    setParadas([nova, ...paradas])
  }

  function finalizarParada(id: number) {
    setParadas(
      paradas.map(p =>
        p.id === id
          ? { ...p, fim: form.fimManual || new Date().toLocaleString() }
          : p
      )
    )
  }

  const abertas = paradas.filter(p => !p.fim)

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#1e3a8a' }}>
        VIGOR Alimentos - SCS | Registro de Paradas – MES Offline
      </h1>

      {abertas.length > 0 && (
        <div style={{ background: '#fee2e2', padding: 12, borderRadius: 8 }}>
          <strong>⚠ Paradas em aberto</strong>
          <ul>
            {abertas.map(p => (
              <li key={p.id}>
                {p.setor} - {p.maquina} (desde {p.inicio})
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>Registro de Parada</h2>

      <div style={{ display: 'grid', gap: 8 }}>
        <input placeholder="Setor" onChange={e => setForm({ ...form, setor: e.target.value })} />
        <input placeholder="Máquina" onChange={e => setForm({ ...form, maquina: e.target.value })} />

        <select onChange={e => setForm({ ...form, turno: e.target.value })}>
          <option>1º</option>
          <option>2º</option>
          <option>3º</option>
        </select>

        <input placeholder="Código da parada" onChange={e => setForm({ ...form, codigo: e.target.value })} />
        <input placeholder="Descrição" onChange={e => setForm({ ...form, descricao: e.target.value })} />

        <label>Hora início (opcional)</label>
        <input type="datetime-local" onChange={e => setForm({ ...form, inicioManual: e.target.value })} />

        <label>Hora fim (opcional)</label>
        <input type="datetime-local" onChange={e => setForm({ ...form, fimManual: e.target.value })} />

        <button onClick={iniciarParada}>▶ Iniciar Parada</button>
      </div>

      <h2 style={{ marginTop: 30 }}>Relatório</h2>

      <table border={1} cellPadding={6} width="100%">
        <thead>
          <tr>
            <th>Setor</th>
            <th>Máquina</th>
            <th>Turno</th>
            <th>Código</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {paradas.map(p => (
            <tr key={p.id} style={{ background: p.fim ? '#fff' : '#fee2e2' }}>
              <td>{p.setor}</td>
              <td>{p.maquina}</td>
              <td>{p.turno}</td>
              <td>{p.codigo}</td>
              <td>{p.inicio}</td>
              <td>{p.fim || 'EM ABERTO'}</td>
              <td>
                {!p.fim && (
                  <button onClick={() => finalizarParada(p.id)}>
                    Finalizar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
