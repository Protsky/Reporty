import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  AddCircleOutline,
  Delete,
  AttachFile,
  GetApp,
} from "@mui/icons-material";

const Costi = () => {
  const [costi, setCosti] = useState([]);
  const [nuovoCosto, setNuovoCosto] = useState({
    nome: "",
    prezzo: 0,
    mese: "",
    descrizione: "",
    giustificativo: null,
  });
  const [mese, setMese] = useState("");
  const [visualizzaMese, setVisualizzaMese] = useState("Tutti i mesi");

  const gestisciCambioNome = (evento) => {
    setNuovoCosto({ ...nuovoCosto, nome: evento.target.value });
  };

  const gestisciCambioPrezzo = (evento) => {
    setNuovoCosto({ ...nuovoCosto, prezzo: parseFloat(evento.target.value) });
  };

  const gestisciCambioDescrizione = (evento) => {
    setNuovoCosto({ ...nuovoCosto, descrizione: evento.target.value });
  };

  const gestisciAggiuntaCosto = () => {
    if (nuovoCosto.nome && nuovoCosto.prezzo > 0) {
      setCosti([...costi, { ...nuovoCosto }]);
      setNuovoCosto({
        nome: "",
        prezzo: 0,
        mese,
        descrizione: "",
        giustificativo: null,
      });
    }
  };

  const gestisciEliminaCosto = (indice) => {
    const costiAggiornati = costi.filter((_, i) => i !== indice);
    setCosti(costiAggiornati);
  };

  const costoTotale = costi
    .filter(
      (costo) =>
        visualizzaMese === "Tutti i mesi" || costo.mese === visualizzaMese
    )
    .reduce((totale, costo) => totale + costo.prezzo, 0);

  const mesi = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];

  return (
    <Container maxWidth="md" style={{ marginTop: "40px", display: "flex" }}>
      <div style={{ flex: 1, marginRight: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Select
            label="Mese"
            value={mese}
            onChange={(evento) => {
              setMese(evento.target.value);
              setNuovoCosto({ ...nuovoCosto, mese: evento.target.value });
            }}
            variant="outlined"
          >
            <MenuItem value="Seleziona un mese">
              <em>Seleziona un mese</em>
            </MenuItem>
            {mesi.map((mese, index) => (
              <MenuItem key={index} value={mese}>
                {mese}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Nome costo"
            value={nuovoCosto.nome}
            onChange={gestisciCambioNome}
            variant="outlined"
          />
          <TextField
            label="Prezzo"
            type="number"
            value={nuovoCosto.prezzo}
            onChange={gestisciCambioPrezzo}
            variant="outlined"
          />
          <TextField
            label="Descrizione"
            value={nuovoCosto.descrizione}
            onChange={gestisciCambioDescrizione}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <AttachFile />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            onClick={gestisciAggiuntaCosto}
          >
            Aggiungi Costo
          </Button>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Typography variant="h5">Panoramica</Typography>
        <Select
          label="Visualizza Mese"
          value={visualizzaMese}
          onChange={(evento) => setVisualizzaMese(evento.target.value)}
          variant="outlined"
        >
          <MenuItem value="Tutti i mesi">Tutti i mesi</MenuItem>
          {mesi.map((mese, index) => (
            <MenuItem key={index} value={mese}>
              {mese}
            </MenuItem>
          ))}
        </Select>
        <List>
          {costi
            .filter(
              (costo) =>
                visualizzaMese === "Tutti i mesi" ||
                costo.mese === visualizzaMese
            )
            .map((costo, indice) => (
              <ListItem key={indice}>
                <ListItemText primary={`${costo.nome}: CHF ${costo.prezzo}`} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => gestisciEliminaCosto(indice)}>
                    <Delete />
                  </IconButton>
                  <IconButton>
                    <GetApp />
                  </IconButton>
                  
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
        <Typography variant="body1">
          Totale Costi Mensili: CHF {costoTotale}
        </Typography>
      </div>
    </Container>
  );
};

export default Costi;
