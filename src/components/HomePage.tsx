import React from 'react';
import { BookOpen, Users, Globe, Award, MapPin, Phone, Mail, ExternalLink, Calendar, GraduationCap, Building2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            ISPA Amiens
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Institut Supérieur de Propédeutique d'Amiens
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Fondé en 2011, l'ISPA est un établissement privé d'enseignement supérieur spécialisé 
            dans l'accueil d'étudiants internationaux et la formation en Français Langue Étrangère (FLE). 
            Situé au cœur d'Amiens, l'institut propose des programmes propédeutiques innovants 
            préparant à l'intégration dans l'enseignement supérieur français.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Programmes Propédeutiques</h3>
            <p className="text-gray-600">Préparation intensive à l'enseignement supérieur français (6 à 18 mois)</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
            <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Cours Intensifs FLE</h3>
            <p className="text-gray-600">20h/semaine, tous niveaux A1 à C1, rentrées chaque lundi</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
            <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Centre d'Examens</h3>
            <p className="text-gray-600">Agréé DELF, TCF, TEF et TOEIC - Préparation et passation sur place</p>
          </div>
        </div>
      </section>

      {/* Accréditations et Reconnaissances */}
      <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🏆 Accréditations et Reconnaissances
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Label Qualité FLE</h3>
                <p className="text-gray-600">
                  Labellisé depuis 2015 par les Ministères de l'Enseignement supérieur, 
                  de la Culture et des Affaires étrangères. Garantie de qualité reconnue par l'État français.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Building2 className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Certification Qualiopi</h3>
                <p className="text-gray-600">
                  Certifié depuis 2021 pour la qualité des processus pédagogiques. 
                  Formations éligibles CPF et financements publics.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Globe className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Réseaux Nationaux</h3>
                <p className="text-gray-600">
                  Membre du Forum Campus France (2018) et du Groupement FLE (2018). 
                  Intégré aux réseaux d'excellence de l'enseignement supérieur français.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-4">📊 Chiffres Clés</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>95%</strong> de réussite en poursuite d'études</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span><strong>50+</strong> nationalités accueillies</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span><strong>2011</strong> année de fondation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span><strong>2 sites</strong> : Amiens et Lille</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Formations Proposées */}
      <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📚 Nos Formations
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                Programmes Propédeutiques
              </h3>
              <p className="text-gray-600 mb-4">
                Parcours intensifs de 6 à 18 mois combinant français avancé (B2→C1), 
                méthodologie universitaire et formation culturelle.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Filière générale FLE</li>
                <li>• Filière Économie/Gestion</li>
                <li>• Filière Art et Musique</li>
                <li>• Filière Hôtellerie-Restauration</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                Cours Intensifs FLE
              </h3>
              <p className="text-gray-600 mb-4">
                20h/semaine, rentrées chaque lundi, durées modulables de 1 à 36 semaines. 
                Niveaux A2 à B2, approche actionnelle et immersive.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Thématiques culturelles hebdomadaires</li>
                <li>• Complément e-learning</li>
                <li>• Activités culturelles incluses</li>
                <li>• Cours particuliers disponibles</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-6 h-6 text-orange-600" />
                Français Professionnel
              </h3>
              <p className="text-gray-600 mb-4">
                Formations orientées monde du travail, éligibles CPF. 
                Interventions en entreprise et préparation à l'insertion professionnelle.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Communication en entreprise</li>
                <li>• Français des affaires</li>
                <li>• Formations sur site</li>
                <li>• Partenariat OFII</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-600" />
                Certifications Officielles
              </h3>
              <p className="text-gray-600 mb-4">
                Centre agréé pour les principaux examens de langue. 
                Préparation intensive et passation sur place.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• DELF/DALF (depuis 2021)</li>
                <li>• TCF/TEF (depuis 2014)</li>
                <li>• TOEIC (depuis 2024)</li>
                <li>• TCF Intégration/Naturalisation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partenariats */}
      <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🤝 Partenariats Académiques
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">UniLaSalle Amiens</h4>
            <p className="text-sm text-gray-600">Grande École d'ingénieurs</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">ESC Amiens</h4>
            <p className="text-sm text-gray-600">École de Commerce</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <Globe className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">CRR Amiens</h4>
            <p className="text-sm text-gray-600">Conservatoire Régional</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <Award className="w-10 h-10 text-orange-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Lycée Saint-Martin</h4>
            <p className="text-sm text-gray-600">Hôtellerie-Restauration</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 max-w-3xl mx-auto">
            Ces partenariats facilitent l'intégration de nos étudiants dans l'enseignement supérieur français 
            avec des conditions d'admission privilégiées et un accompagnement dédié.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📍 Nous Contacter
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Adresse</h3>
                <p className="text-gray-600">
                  5 rue des Francs-Mûriers<br />
                  80000 Amiens, France<br />
                  <span className="text-sm text-gray-500">Quartier Saint-Leu • Centre-ville</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Téléphone</h3>
                <p className="text-gray-600">+33 (0)3 XX XX XX XX</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <p className="text-gray-600">contact@amiens-ispa.fr</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <ExternalLink className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Site Web</h3>
                <p className="text-gray-600">amiens-ispa.fr</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informations Pratiques
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• <strong>Rentrées :</strong> Octobre, Janvier, Mai (propédeutiques)</li>
              <li>• <strong>FLE intensif :</strong> Rentrées chaque lundi</li>
              <li>• <strong>Test de niveau :</strong> Gratuit avant inscription</li>
              <li>• <strong>Visa étudiant :</strong> Accompagnement complet</li>
              <li>• <strong>Logement :</strong> Service d'aide au logement</li>
              <li>• <strong>Transport :</strong> 15 min à pied de la gare</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tool Description */}
      <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🛠️ Outil de Progression Pédagogique
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-6 leading-relaxed text-center">
            Cet outil permet aux enseignants de l'ISPA de créer et organiser leurs progressions 
            annuelles par glisser-déposer. Chaque progression peut être personnalisée, sauvegardée 
            et partagée selon les besoins pédagogiques de l'équipe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-3">✨ Fonctionnalités</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Organisation par glisser-déposer</li>
                <li>• Sauvegarde partagée en temps réel</li>
                <li>• Export Word/PDF par progression</li>
                <li>• Import/Export JSON global</li>
                <li>• Étiquettes personnalisables</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-semibold text-gray-800 mb-3">👥 Collaboration</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Modifications visibles par tous</li>
                <li>• Sauvegarde automatique</li>
                <li>• Partage entre enseignants</li>
                <li>• Historique des modifications</li>
                <li>• Interface intuitive</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}