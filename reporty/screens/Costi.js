import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";

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

const firebaseConfig = {
  apiKey: "AIzaSyCJorBqsG0xTm9unbxnj6NLtb1WWTgL3BE",
  authDomain: "reporty-b66fa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reporty-b66fa",
  storageBucket: "reporty-b66fa.appspot.com",
  messagingSenderId: "504973056130",
  appId: "1:504973056130:web:f5f21a9855d89618907c9b",
  measurementId: "G-1SH61TVL1V",
  databaseURL:
    "https://reporty-b66fa-default-rtdb.europe-west1.firebasedatabase.app",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();


const Costi = () => {
  const [costi, setCosti] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nuovoCosto, setNuovoCosto] = useState({
    nome: "",
    prezzo: 0,
    mese: "",
    descrizione: "",
    giustificativo: null,
  });
  const [mese, setMese] = useState("");
  const [visualizzaMese, setVisualizzaMese] = useState("Tutti i mesi");
  const handleDownload = (downloadURL) => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.target = "_blank"; // Apri il link in una nuova finestra/tab
    link.download = "giustificativo.pdf"; // Modifica l'estensione del file se necessario
    link.click();
  };

  useEffect(() => {
    const costiRef = database.ref("costi");
    costiRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const costiArray = Object.entries(data).map(([key, value]) => ({
          key, // Aggiungi la chiave dell'elemento
          ...value,
        }));
        setCosti(costiArray);
      }
    });

    return () => costiRef.off("value");
  }, []);

  const gestisciCambioNome = (evento) => {
    setNuovoCosto({ ...nuovoCosto, nome: evento.target.value });
  };

  const gestisciCambioPrezzo = (evento) => {
    setNuovoCosto({ ...nuovoCosto, prezzo: parseFloat(evento.target.value) });
  };

  const gestisciCambioDescrizione = (evento) => {
    setNuovoCosto({ ...nuovoCosto, descrizione: evento.target.value });
  };

  const handleAddCosto = async () => {
    const { nome, prezzo, descrizione, mese } = nuovoCosto;
  
    if (nome && prezzo && mese) {
      try {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(selectedFile.name);
  
        // Carica il file su Firebase Storage
        await fileRef.put(selectedFile);
  
        // Ottieni l'URL del file appena caricato
        const downloadURL = await fileRef.getDownloadURL();
  
        const nuovoCostoItem = {
          nome: nome,
          prezzo: parseFloat(prezzo),
          descrizione: descrizione,
          mese: mese,
          giustificativo: downloadURL, // Aggiungi l'URL come giustificativo
        };
  
        const costiRef = database.ref("costi");
        costiRef.push(nuovoCostoItem);
  
        setNuovoCosto({
          nome: "",
          prezzo: 0,
          mese: "",
          descrizione: "",
          giustificativo: null,
        });
  
      } catch (error) {
        console.error("Errore durante il caricamento del file:", error);
      }
    }
  };
  

  const gestisciEliminaCosto = (indice, costoKey) => {
    const costiRef = database.ref("costi");

    // Rimuovi l'elemento dal database Firebase utilizzando la chiave
    costiRef.child(costoKey).remove();

    // Aggiorna la lista dei costi localmente escludendo l'elemento eliminato
    const updatedCosti = costi.filter((costo) => costo.key !== costoKey);
    setCosti(updatedCosti);
  };

  const handleFileChange = async (file) => {
    setSelectedFile(file);
  
    if (file) {
      try {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(file.name);
        
        // Carica il file su Firebase Storage
        await fileRef.put(file);
        
        // Ottieni l'URL del file appena caricato
        const downloadURL = await fileRef.getDownloadURL();
        
        // Puoi fare altro con l'URL, ad esempio salvarlo nel database Firebase
        console.log("URL del file:", downloadURL);
      } catch (error) {
        console.error("Errore durante il caricamento del file:", error);
      }
    }
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
                    <label htmlFor="fileInput">
                      <AttachFile />
                    </label>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e.target.files[0])}
          />

          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            onClick={handleAddCosto}
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
                  <IconButton
                    onClick={() => gestisciEliminaCosto(indice, costo.key)}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleDownload(costo.giustificativo)}>
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
