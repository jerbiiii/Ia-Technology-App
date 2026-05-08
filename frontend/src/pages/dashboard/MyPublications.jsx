import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilePdf, FaCalendarAlt, FaPlus, FaTimes } from 'react-icons/fa';
import publicationService from '../../services/publication.service';
import PublicationForm from './PublicationForm';
import './MyPublications.css';

const MyPublications = ({ chercheurId }) => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPub, setEditingPub] = useState(null);

    useEffect(() => {
        if (chercheurId) {
            fetchPublications();
        }
    }, [chercheurId]);

    const fetchPublications = async () => {
        try {
            const data = await publicationService.getByChercheurId(chercheurId);
            setPublications(data);
        } catch (error) {
            console.error('Erreur chargement publications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            await publicationService.downloadFile(id);
        } catch (error) {
            alert('Erreur lors du téléchargement');
        }
    };

    const handleSuccess = () => {
        setShowForm(false);
        setEditingPub(null);
        fetchPublications();
    };

    if (loading) return <div className="loader">Chargement de vos publications...</div>;

    return (
        <div className="my-publications">
            <div className="section-header">
                <h2>Mes publications</h2>
                <button className="btn-add-pub" onClick={() => setShowForm(true)}>
                    <FaPlus /> Ajouter une publication
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="modal-header">
                                <h3>{editingPub ? 'Modifier la publication' : 'Nouvelle publication'}</h3>
                                <button className="btn-close" onClick={() => { setShowForm(false); setEditingPub(null); }}>
                                    <FaTimes />
                                </button>
                            </div>
                            <PublicationForm 
                                researcherId={chercheurId} 
                                initialData={editingPub}
                                onSuccess={handleSuccess}
                                onCancel={() => { setShowForm(false); setEditingPub(null); }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {publications.length === 0 ? (
                <div className="no-publications">
                    <p>Vous n'avez pas encore de publications.</p>
                    <Link to="/publications" className="btn-primary">Explorer les publications</Link>
                </div>
            ) : (
                <div className="publications-list">
                    {publications.map(pub => (
                        <motion.div
                            key={pub.id}
                            className="publication-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
                        >
                            <div className="item-content">
                                <h3>
                                    <Link to={`/publications/${pub.id}`}>{pub.titre}</Link>
                                </h3>
                                <p className="abstract">{pub.resume ? (pub.resume.length > 150 ? pub.resume.substring(0,150)+'...' : pub.resume) : 'Aucun résumé'}</p>
                                <div className="meta">
                                    <span><FaCalendarAlt /> {pub.datePublication ? new Date(pub.datePublication).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
                                    <div className="actions">
                                        {pub.cheminFichier && (
                                            <button onClick={() => handleDownload(pub.id)} className="btn-download" title="Télécharger PDF">
                                                <FaFilePdf />
                                            </button>
                                        )}
                                        <button 
                                            className="btn-edit-small" 
                                            onClick={() => { setEditingPub(pub); setShowForm(true); }}
                                            title="Modifier"
                                        >
                                            Modifier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPublications;