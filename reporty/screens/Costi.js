import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import ReactDOM from "react-dom";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryTooltip, // Make sure to add this import
  VictoryVoronoiContainer, // Make sure to add this import
} from "victory";

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

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 },
];

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
  const [monthlyCosts, setMonthlyCosts] = useState({});

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

        // Calculate monthly costs
        const monthlyCostsData = costiArray.reduce((acc, costo) => {
          const { mese, prezzo } = costo;
          if (!acc[mese]) {
            acc[mese] = 0;
          }
          acc[mese] += prezzo;
          return acc;
        }, {});

        setMonthlyCosts(monthlyCostsData);
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
            <MenuItem value="">
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
                  <IconButton
                    onClick={() => handleDownload(costo.giustificativo)}
                  >
                    <GetApp />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>

        <Typography variant="body1">
          Totale Costi Mensili: CHF {costoTotale}
        </Typography>

        <VictoryChart
          // adding the material theme provided with Victory
          theme={VictoryTheme.material}
          width={800} // Adjust the width as needed
          height={400} // Adjust the height as needed
          domainPadding={{ x: 20 }} // Add padding to the x-axis
          padding={{ top: 20, bottom: 50, left: 60, right: 20 }} // Add overall padding
          containerComponent={
            <VictoryVoronoiContainer // Use Voronoi container for better tooltips
              labels={({ datum }) => `${mesi[datum.x - 1]}: CHF ${datum.y}`}
              labelComponent={<VictoryTooltip style={{ fontSize: 10 }} />}
            />
          }
        >
          <VictoryAxis
            tickValues={mesi.map((_, index) => index + 1)}
            tickFormat={mesi}
            style={{ tickLabels: { fontSize: 20, angle: 15 } }} // Adjust font size and angle
          />
          <VictoryAxis dependentAxis tickFormat={(x) => `CHF ${x}`} />
          <VictoryBar
            data={mesi.map((mese, index) => ({
              x: mese, // Use the month name as the x-value
              y: monthlyCosts[mese] || 0, // Get the corresponding y value for the month
            }))}
            x="x"
            y="y"
            style={{ data: { width: 15 } }} // Adjust the width of bars
          />
        </VictoryChart>
      </div>
    </Container>
  );
};

export default Costi;
