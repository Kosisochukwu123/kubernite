NOTE: OPEN THE APPLICATION AND SCROLL DOWN TO THE SECTION> I DID THE ASSIGNMENT ON 0:30 - 0:40 in the VIDEO

# 🎯 Cluster Drilldown Component

A beautiful, interactive cost visualization tool that lets you drill down from clusters → namespaces → pods to understand your Kubernetes spending.

---

## 🛠️ Tools & Technologies Used

| Tool | Purpose |
|------|---------|
| **React 18** | UI framework for building interactive components |
| **CSS3** | Custom styling with animations and responsive design |
| **Fetch API** | For making HTTP requests to the backend |
| **Node.js** | JavaScript runtime for the backend server |
| **Express.js** | Web framework for creating REST APIs |
| **CORS** | Middleware to allow frontend-backend communication |
| **Vite** | Fast build tool and dev server |
| **npm** | Package manager |

---

## 📁 Project Structure
project/
├── frontend/
│ └── src/
│ └── pages/
│ └── common/
│ ├── ClusterDrilldown.jsx # Main component
│ └── ClusterDrilldown.css # Styles & animations
│
└── backend/
└── server.js # Express API server

text

---

## 🚀 How It Works

**Data Flow:** User clicks bar → Updates navigation stack → Fetches new data → Re-renders view

**Three-Level Drilldown:**
- Level 1: Clusters (Cluster A, Cluster B, ...)
- Level 2: Namespaces (Namespace A, Namespace B, ...)
- Level 3: Pods (Pod A, Pod B, ...)

**Key Features:**
- Bar Chart - Visualizes cost distribution with grow animations
- Data Table - Shows detailed cost breakdown by resource type
- Breadcrumb - Shows your current navigation path
- Stepper - Visual indicator of current drilldown level
- Back Button - Navigate to previous levels
- CSV Export - Download current view as CSV file
- Loading Skeletons - Smooth loading states
- Error Handling - User-friendly error messages with retry

---

## 🎨 Design System

**Colors:**
- --cd-lime: #52e89a (Primary green)
- --cd-lime-mid: #3dd180 (Hover states)
- --cd-lime-dk: #1a9956 (Dark green)
- --cd-bg: #f4f6f4 (Background)
- --cd-surface: #ffffff (Card background)
- --cd-ink: #0e2a1f (Text color)
- --cd-muted: #7a9e8e (Secondary text)
- --cd-border: #d6ede1 (Border color)

**Animations:**
- Bar growth: 0.65s cubic-bezier easing with stagger effect
- Row fade-in: Staggered by 50ms per row
- Breadcrumb: Fade-in with 0.12s delay
- Tooltip: Slide-up with 0.22s delay

---

## 📡 API Endpoint

**Endpoint:** `GET /api/cluster-drilldown`

**Response Structure:**
```json
{
  "breadcrumb": "Cluster",
  "aggregatedBy": "Cluster",
  "bars": [
    { "label": "Cluster A", "height": 100 },
    { "label": "Cluster B", "height": 81 }
  ],
  "rows": [
    {
      "name": "Cluster A",
      "cpu": "$2,463",
      "ram": "$1,368",
      "storage": "$246",
      "net": "$307",
      "gpu": "$821",
      "eff": "10%",
      "total": "$6,867"
    }
  ],
  "children": [ /* Nested data for next level */ ]
}
🏃‍♂️ Running the Project
1. Start the Backend:

bash
cd backend
npm install express cors
node server.js
✅ Server runs on http://localhost:5000

2. Start the Frontend:

bash
cd frontend
npm install
npm run dev
✅ App runs on http://localhost:5173

3. Connect: Enter http://localhost:5000 in the connection screen and start exploring!

🧠 Key Concepts Explained
Navigation Stack:

javascript
navStack = [
  { depth: 0, cluster: null, label: "All Clusters" },
  { depth: 1, cluster: "Cluster A", label: "Cluster A" },
  { depth: 2, cluster: "Cluster A", namespace: "Namespace A", label: "Namespace A" }
]
State Management:

data - Current API response data

loading - Show loading skeletons

error - Display error messages

navStack - Track navigation history

animKey - Trigger re-animations

🎯 Component Hierarchy
text
ClusterDrilldown (Main)
├── SetupScreen (when not configured)
└── MainView
    ├── BreadcrumbPill
    ├── Stepper (depth indicator)
    ├── Chart (Bar components)
    ├── Table (TableRow components)
    └── Export Button
🔄 User Journey
Connect → Enter backend URL

View Clusters → See all clusters with cost bars

Click a bar → Drill down to namespaces

Click again → Drill down to pods

Go Back → Navigate up the hierarchy

Export → Download CSV of current view

💡 Design Decisions
Decision	Reason
Single viewport height	No page scrolling, everything fits in one screen
Staggered animations	Creates smooth, professional feel
Skeleton loaders	Prevents layout shifts while loading
CSV export	Easy data analysis outside the app
Sticky header	Always know where you are
Responsive design	Works on desktop, tablet, and mobile
🐛 Common Issues & Solutions
Issue	Solution
Connection refused	Make sure backend is running on port 5000
No data showing	Check if API returns the expected format
Bars not animating	Check if grown state is updating
404 error	Verify backend endpoint is /api/cluster-drilldown
📈 Future Improvements
Add date range picker

Add filtering by namespace/pod

Add cost forecasting

Add comparison between clusters

Add dark/light theme toggle

Add chart type selector (bar/line/pie)

Add real-time updates via WebSockets

📚 Resources
React Docs: https://react.dev

Express.js Docs: https://expressjs.com

CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations

Vite Guide: https://vitejs.dev/guide/

Made with 💚 for Kubernetes cost visualization | React + Express + Love 🚀

text
