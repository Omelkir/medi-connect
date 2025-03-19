export const menuMed = [
  {
    label: 'Dashboard Med',
    path: '/',
    icon: 'ri-dashboard-fill'
  },
  {
    label: 'Patient',
    path: '/patient',
    icon: 'ri-user-fill'
  },
  { label: 'Dossiers médicaux', path: '/dossier-medicaux', icon: 'ri-file-fill' },
  {
    label: 'Ordonnances',
    path: '/de',
    icon: 'ri-file-line'
  },
  {
    label: 'Rendez-vous',
    path: '/ren',
    icon: 'ri-time-fill',
    subMenu: [
      { label: 'Calendrier', path: '/cal', icon: 'ri-calendar-fill' },
      {
        label: 'Demandes de rendez-vous',
        path: '/de',
        icon: 'ri-file-list-fill'
      }
    ]
  },
  {
    label: 'Rapport',
    path: '/medecin',
    icon: 'ri-file-fill'
  },
  {
    label: 'Paramètres & Profil',
    path: '/ren',
    icon: 'ri-settings-fill'
  },
  {
    label: 'Déconnexion',
    path: '/ren',
    icon: 'ri-logout-circle-line'
  }
]
export const menulabo = [
  {
    label: 'Dashboard Labo',
    path: '/',
    icon: 'ri-dashboard-fill'
  }
]
export const menuAdmin = [
  {
    label: 'Dashboard admin',
    path: '/',
    icon: 'ri-dashboard-fill'
  },
  {
    label: 'Médecin',
    path: '/medecin',
    icon: 'ri-stethoscope-fill'
  },
  {
    label: 'Laboratoire',
    path: '/laboratoire',
    icon: 'ri-microscope-fill'
  },
  {
    label: 'Admin',
    path: '/admin',
    icon: 'ri-vip-crown-fill'
  },
  {
    label: 'Rendez-vous',
    path: '/rendez-vous',
    icon: 'ri-calendar-todo-line'
  },
  {
    label: 'Patient',
    path: '/patient',
    icon: 'ri-user-fill'
  }

  // Autres éléments du menu
]
