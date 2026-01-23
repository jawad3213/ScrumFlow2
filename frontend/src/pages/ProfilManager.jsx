import React, { useState ,useRef } from 'react';
import { User, Briefcase, Shield, Bell, Eye, EyeOff, Camera, UploadCloud, Check } from 'lucide-react';
import styles from './ProfilManager.module.css';
import api from '../lib/axios';


export default function ProfilManager() {
  const [activeSection, setActiveSection] = useState('profil');
  
  const [formData, setFormData] = useState({
    username: 'Alexandre',
    firstname: 'Dubois',
    email: 'alexandre.dubois@gmail.com',
    experience: 'Développeur Frontend',
    niveau: 'Intermédiaire',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

   const fileInputRef = useRef(null);
   const [preview, setPreview] = useState(null);

  // Fonctions de gestion 
  const handleSaveProfile = () => {
    

    // Ici tu pourras envoyer la requête API vers le backend
  };
  const handleChangePassword = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert('Veuillez remplir tous les champs de mot de passe !');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Le nouveau mot de passe et sa confirmation ne correspondent pas !');
      return;
    }

    console.log('🔒 Changer le mot de passe', formData.newPassword);
    alert('Mot de passe changé (mock) !');
    // Ici tu pourras appeler ton endpoint /reset-password
  };

  const handleUploadPhoto = () => {
    if (fileInputRef.current) {
    fileInputRef.current.click();
  } else {
    console.log('❌ fileInputRef est null');
  }
    // Ici tu pourrais utiliser un input type="file" et envoyer vers le backend
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className={styles.logoText}>SF</span>
            </div>
            <span className={styles.logoName}>Secure Flow</span>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.notificationBtn}>
              <Bell style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            </button>
            <div className={styles.avatar}></div>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Paramètres</h3>
            <nav className={styles.nav}>
              <button 
                className={`${styles.navButton} ${activeSection === 'profil' ? styles.active : ''}`}
                onClick={() => setActiveSection('profil')}
              >
                <User style={{ width: '16px', height: '16px' }} />
                <span>Mon profil</span>
              </button>
              <button 
                className={`${styles.navButton} ${activeSection === 'notifications' ? styles.active : ''}`}
                onClick={() => setActiveSection('notifications')}
              >
                <Bell style={{ width: '16px', height: '16px' }} />
                <span>Notifications</span>
              </button>
              <button 
                className={`${styles.navButton} ${activeSection === 'securite' ? styles.active : ''}`}
                onClick={() => setActiveSection('securite')}
              >
                <Shield style={{ width: '16px', height: '16px' }} />
                <span>Sécurité</span>
              </button>
              <button 
                className={`${styles.navButton} ${activeSection === 'preferences' ? styles.active : ''}`}
                onClick={() => setActiveSection('preferences')}
              >
                <Briefcase style={{ width: '16px', height: '16px' }} />
                <span>Préférences</span>
              </button>
            </nav>
            <div className={styles.sidebarDivider}>
              <h3 className={styles.sidebarTitle}>Organisation</h3>
              <button 
                className={`${styles.navButton} ${activeSection === 'equipe' ? styles.active : ''}`}
                onClick={() => setActiveSection('equipe')}
              >
                <Briefcase style={{ width: '16px', height: '16px' }} />
                <span>Équipe</span>
              </button>
              <button 
                className={`${styles.navButton} ${activeSection === 'entreprise' ? styles.active : ''}`}
                onClick={() => setActiveSection('entreprise')}
              >
                <Briefcase style={{ width: '16px', height: '16px' }} />
                <span>Entreprise</span>
              </button>
            </div>
          </aside>

          <main className={styles.main}>
            {activeSection === 'profil' && (
              <>
                <h1 className={styles.pageTitle}>Paramètres du Profil</h1>

                <div className={styles.alert}>
                  <span className={styles.alertIcon}>⚠️</span>
                  <div>
                    <h3 className={styles.alertTitle}>Changement de mot de passe requis</h3>
                    <p className={styles.alertText}>
                      Votre mot de passe n'a pas été changé depuis plus de 90 jours et doit être mis à jour pour des raisons de sécurité.
                    </p>
                  </div>
                </div>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={`${styles.sectionIcon} ${styles.purple}`}>
                      <User style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h2 className={styles.sectionTitle}>Informations Personnelles</h2>
                  </div>
                  
                  <div className={styles.photoUploadContainer}>
                    <div className={styles.avatarWrapper}>
                      <img 
                        src={preview || "Lien_Vers_Ton_Image.jpg"}
                        alt="Profile" 
                        className={styles.profileImage} 
                      />
                      <div className={styles.cameraBadge}>
                        <Camera size={14} color="white" />
                      </div>
                    </div>
                    <div className={styles.uploadActions}>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        
                      />
                      <button type="button" className={styles.uploadBtn} onClick={handleUploadPhoto}>
                        <UploadCloud size={16} />
                        Téléverser une photo
                      </button>
                      <p className={styles.uploadTerms}>
                        JPG, PNG ou GIF. Taille maximale : 2MB. Recommandé : 400×400px
                      </p>
                    </div>
                  </div>
                    
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Nom</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Prénom</label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email professionnel</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <button className={`${styles.button} ${styles.buttonCancel}`}>Annuler</button>
                    <button className={styles.btnSave} onClick={handleSaveProfile}>
                      <Check size={18} />
                      Enregistrer
                    </button>
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={`${styles.sectionIcon} ${styles.blue}`}>
                      <Briefcase style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h2 className={styles.sectionTitle}>Détails Professionnels</h2>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Expérience / Rôle</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Exemple: Responsable Marketing"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Niveau d'expérience</label>
                      <select
                        name="niveau"
                        value={formData.niveau}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                      >
                        <option>Débutant</option>
                        <option>Intermédiaire</option>
                        <option>Junior</option>
                        <option>Senior</option>
                        <option>Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.infoBox}>
                    <p>
                      💡 Ces informations permettent de vous recommander des formations, des projets et des offres d'emploi adaptés à votre profil.
                    </p>
                  </div>

                  <div className={styles.buttonGroup}>
                    <button className={`${styles.button} ${styles.buttonCancel}`}>Annuler</button>
                    <button className={`${styles.button} ${styles.buttonPrimary}`}>Sauvegarder</button>
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={`${styles.sectionIcon} ${styles.red}`}>
                      <Shield style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h2 className={styles.sectionTitle}>Sécurité</h2>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    Définir un nouveau mot de passe
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Mot de passe actuel</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className={styles.passwordInput}
                        />
                        <button
                          onClick={() => togglePasswordVisibility('current')}
                          className={styles.togglePasswordBtn}
                        >
                          {showPasswords.current ? 
                            <EyeOff style={{ width: '16px', height: '16px' }} /> : 
                            <Eye style={{ width: '16px', height: '16px' }} />
                          }
                        </button>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Nouveau mot de passe</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className={styles.passwordInput}
                        />
                        <button
                          onClick={() => togglePasswordVisibility('new')}
                          className={styles.togglePasswordBtn}
                        >
                          {showPasswords.new ? 
                            <EyeOff style={{ width: '16px', height: '16px' }} /> : 
                            <Eye style={{ width: '16px', height: '16px' }} />
                          }
                        </button>
                      </div>
                    </div>

                    <div className={styles.passwordRequirements}>
                      Votre mot de passe doit contenir:<br />
                      • Au moins 8 caractères<br />
                      • Une lettre majuscule et une minuscule<br />
                      • Au moins un chiffre ou un symbole
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Confirmer le nouveau mot de passe</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className={styles.passwordInput}
                        />
                        <button
                          onClick={() => togglePasswordVisibility('confirm')}
                          className={styles.togglePasswordBtn}
                        >
                          {showPasswords.confirm ? 
                            <EyeOff style={{ width: '16px', height: '16px' }} /> : 
                            <Eye style={{ width: '16px', height: '16px' }} />
                          }
                        </button>
                      </div>
                    </div>

                    <p className={styles.passwordNote}>
                      Laissez les champs vides si vous ne souhaitez pas modifier votre mot de passe.
                    </p>
                  </div>

                  <div className={styles.buttonGroup}>
                    <button className={`${styles.button} ${styles.buttonCancel}`}>Annuler</button>
                    <button className={`${styles.button} ${styles.buttonDanger}`}>Changer le mot de passe</button>
                  </div>
                </section>
              </>
            )}

            {activeSection === 'notifications' && (
              <div>
                <h1 className={styles.pageTitle}>Notifications</h1>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={`${styles.sectionIcon} ${styles.blue}`}>
                      <Bell style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h2 className={styles.sectionTitle}>Paramètres de Notifications</h2>
                  </div>
                  <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                    Configuration des notifications à venir...
                  </p>
                </section>
              </div>
            )}

            {activeSection === 'securite' && (
              <div>
                <h1 className={styles.pageTitle}>Sécurité</h1>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={`${styles.sectionIcon} ${styles.red}`}>
                      <Shield style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h2 className={styles.sectionTitle}>Paramètres de Sécurité</h2>
                  </div>
                  <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                    Paramètres de sécurité avancés à venir...
                  </p>
                </section>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div>
                <h1 className={styles.pageTitle}>Préférences</h1>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={`${styles.sectionIcon} ${styles.purple}`}>
                      <Briefcase style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h2 className={styles.sectionTitle}>Préférences Utilisateur</h2>
                  </div>
                  <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                    Vos préférences personnalisées à venir...
                  </p>
                </section>
              </div>
            )}

            {activeSection === 'equipe' && (
              <div>
                <h1 className={styles.pageTitle}>Équipe</h1>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={`${styles.sectionIcon} ${styles.blue}`}>
                      <User style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h2 className={styles.sectionTitle}>Gestion de l'Équipe</h2>
                  </div>
                  <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                    Gestion de votre équipe à venir...
                  </p>
                </section>
              </div>
            )}

            {activeSection === 'entreprise' && (
              <div>
                <h1 className={styles.pageTitle}>Entreprise</h1>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={`${styles.sectionIcon} ${styles.purple}`}>
                      <Briefcase style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <h2 className={styles.sectionTitle}>Paramètres de l'Entreprise</h2>
                  </div>
                  <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                    Paramètres de l'entreprise à venir...
                  </p>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}