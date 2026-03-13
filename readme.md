# AI Electronics Circuit Designer

An **AI-powered electronic circuit design platform** where users can describe their electronic ideas in natural language, and the system automatically generates a **structured circuit design compatible with KiCad-like JSON**, renders it visually in a canvas, and allows users to modify and extend the design interactively.

This project demonstrates **LLM-driven engineering design, AI model routing, interactive circuit editing, and machine learning dataset generation**.

---

# 🚀 Project Overview

The goal of this project is to create an **AI-assisted electronics design environment** that bridges natural language ideas and practical circuit diagrams.

Users can:

1. Describe an electronic idea in plain English.
2. AI generates a structured circuit design.
3. The circuit is rendered visually in a canvas.
4. Users can modify the circuit interactively.
5. AI can refine or extend the design.
6. All interactions are stored to build a **training dataset for future ML models**.

---

# 🧠 Core Features

## 1. Natural Language Circuit Generation

Users can input an electronic idea such as:

> "Create a simple LED blinking circuit using a 555 timer powered by a 9V battery."

The AI system converts this idea into a **structured circuit design JSON** including:

* components
* connections
* placements

---

## 2. KiCad-Compatible Circuit JSON

The AI generates a structured JSON schema similar to PCB design tools.

Example:

```json
{
  "project_name": "LED Blinker",
  "components": [
    {
      "id": "R1",
      "type": "resistor",
      "value": "220",
      "position": { "x": 120, "y": 200 }
    },
    {
      "id": "LED1",
      "type": "led",
      "color": "red",
      "position": { "x": 200, "y": 200 }
    }
  ],
  "connections": [
    { "from": "R1.pin1", "to": "LED1.anode" }
  ]
}
```

This structure can be easily rendered or exported to circuit design tools.

---

## 3. Interactive Circuit Canvas

The generated circuit is visualized inside a **React canvas editor**.

Users can:

* Move components
* Add new components
* Modify values (resistor, capacitor, etc.)
* Delete or add connections
* Expand the circuit design

---

## 4. AI Circuit Modification

Users can continue improving their circuit using natural language commands such as:

* "Add a capacitor to control blinking speed"
* "Change resistor value to 1k"
* "Add a voltage regulator"

The system modifies the existing circuit JSON while preserving the current design.

---

## 5. LLM Gateway (Model Routing)

The system includes a **Model Gateway** that routes prompts to different AI models depending on complexity.

Routing strategy:

| Prompt Complexity           | Model     |
| --------------------------- | --------- |
| Simple prompts              | Local LLM |
| Medium prompts              | OpenAI    |
| Complex engineering prompts | Anthropic |

Benefits:

* Cost optimization
* Performance optimization
* Model flexibility

---

## 6. Circuit Design Validation

The AI system can analyze generated circuits and detect potential issues such as:

* Missing resistors
* Incorrect polarity
* Power supply issues
* Unsafe component configurations

This helps ensure **realistic and functional circuit designs**.

---

## 7. AI-Assisted Component Suggestions

The system can recommend:

* additional components
* optimal resistor values
* protection circuits
* improved power design

---

## 8. Dataset Collection for Machine Learning

All interactions are stored to build a **future training dataset**.

Stored data includes:

* user idea prompts
* generated circuit designs
* user modifications
* final designs

This dataset can later be used to train:

* circuit generation models
* circuit optimization models
* component placement models

---

# 🏗️ System Architecture

```
React Frontend
      │
      │ REST API
      ▼
Python FastAPI Backend
      │
      ├── LLM Gateway
      │     ├ OpenAI
      │     ├ Anthropic
      │     └ Local LLM
      │
      ├── Circuit Generator
      ├── Circuit Modifier
      ├── Design Validator
      └── ML Dataset Storage
```

---

# 📂 Project Structure

```
ai-electronics-circuit-designer

frontend/
    src/
        components/
        canvas/
        pages/
        services/
        utils/

backend/
    app/
        api/
        agents/
        llm_gateway/
        circuit_engine/
        ml_dataset/
        models/
        services/

    main.py
```

---

# ⚙️ Tech Stack

## Frontend

* React
* TypeScript
* Canvas Rendering (React Konva / Fabric.js)
* Tailwind CSS

---

## Backend

* Python
* FastAPI
* Async APIs
* AI orchestration services

---

## AI / Machine Learning

* LLM-based circuit generation
* Prompt engineering
* Model routing gateway
* Circuit validation AI
* Future ML training pipeline

---

## Databases

* PostgreSQL or MongoDB
* ML dataset storage
* Circuit design storage

---

## Infrastructure

* Docker (optional)
* REST APIs
* Model Gateway architecture

---

# 🧩 Key Modules

## Circuit Generator

Transforms user ideas into structured circuit designs.

## Circuit Modifier

Updates existing circuits based on user instructions.

## Model Gateway

Routes prompts to the appropriate AI model.

## Circuit Validator

Analyzes circuit correctness.

## Dataset Collector

Stores design interactions for future ML training.

---

# 🔄 Example Workflow

```
User Idea
   │
   ▼
LLM Circuit Generator
   │
   ▼
Circuit JSON Output
   │
   ▼
React Canvas Rendering
   │
   ▼
User Edits Circuit
   │
   ▼
AI Circuit Modification
   │
   ▼
Final Circuit Design
   │
   ▼
Dataset Storage for ML Training
```

---

# 📊 Future Enhancements

* KiCad file export
* PCB layout generation
* Electrical simulation
* AI component recommendation engine
* Automatic PCB routing
* Hardware validation models

---

# 🎯 Use Cases

* Electronics prototyping
* Educational electronics tools
* Hardware design assistance
* AI-powered circuit ideation
* PCB concept generation

---

# 🧪 Example AI Prompts

Example idea prompt:

```
Create a temperature monitoring circuit using Arduino and a temperature sensor.
```

Example modification prompt:

```
Add an LCD display to show the temperature readings.
```

---

# 📈 Long-Term Vision

The long-term vision of this project is to evolve into a **fully AI-powered electronic design assistant** capable of:

* generating circuits
* validating hardware
* optimizing component selection
* automatically generating PCB layouts

---

# 🤝 Contributions

Contributions are welcome. If you'd like to improve the AI models, circuit engine, or UI, feel free to submit pull requests.

---

# 📄 License

MIT License
