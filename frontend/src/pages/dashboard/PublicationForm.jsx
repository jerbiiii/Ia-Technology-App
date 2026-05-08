import { useState, useEffect } from 'react';
import publicationService from '../../services/publication.service';
import domainService from '../../services/domain.service';
import './PublicationForm.css';

const PublicationForm = ({ initialData, researcherId, onSuccess, onCancel }) => {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        titre: '',
        resume: '',
        datePublication: new Date().toISOString().substring(0, 10),
        doi: '',
        chercheursIds: [researcherId],
        domainesIds: [],
        fichier: null
    });
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dom = await domainService.getAll();
                setDomains(Array.isArray(dom) ? dom : (dom.content || []));
                
                if (initialData) {
                    setFormData({
                        ...initialData,
                        datePublication: initialData.datePublication ? initialData.datePublication.substring(0, 10) : '',
                        chercheursIds: initialData.chercheursIds || [researcherId],
                        domainesIds: initialData.domainesIds || [],
                        fichier: null
                    });
                    if (initialData.cheminFichier) {
                        setFilePreview('Fichier existant');
                    }
                }
            } catch (error) {
                console.error('Erreur chargement domaines:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [initialData, researcherId]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData({ ...formData, fichier: file });
            setFilePreview(file ? file.name : null);
        } else if (type === 'select-multiple') {
            const options = e.target.options;
            const selected = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    selected.push(Number(options[i].value));
                }
            }
            setFormData({ ...formData, [name]: selected });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            const publicationJson = {
                titre: formData.titre,
                resume: formData.resume,
                datePublication: formData.datePublication,
                doi: formData.doi,
                chercheursIds: formData.chercheursIds.includes(researcherId) 
                    ? formData.chercheursIds 
                    : [...formData.chercheursIds, researcherId],
                domainesIds: formData.domainesIds
            };
            
            formDataToSend.append('publication', new Blob([JSON.stringify(publicationJson)], { type: 'application/json' }));
            if (formData.fichier) {
                formDataToSend.append('fichier', formData.fichier);
            }

            if (initialData?.id) {
                await publicationService.update(initialData.id, formDataToSend);
            } else {
                await publicationService.create(formDataToSend);
            }
            onSuccess();
        } catch (error) {
            alert('Erreur lors de l\'enregistrement');
        }
    };

    if (loading) return <div className="loader">Chargement...</div>;

    return (
        <form onSubmit={handleSubmit} className="dashboard-publication-form">
            <div className="form-group">
                <label>Titre *</label>
                <input type="text" name="titre" value={formData.titre} onChange={handleInputChange} required placeholder="Titre de la publication" />
            </div>
            <div className="form-group">
                <label>Résumé</label>
                <textarea name="resume" rows="4" value={formData.resume} onChange={handleInputChange} placeholder="Résumé de vos travaux..." />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Date de publication</label>
                    <input type="date" name="datePublication" value={formData.datePublication} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>DOI (Optionnel)</label>
                    <input type="text" name="doi" value={formData.doi} onChange={handleInputChange} placeholder="Ex: 10.1000/xyz123" />
                </div>
            </div>
            <div className="form-group">
                <label>Domaines scientifiques</label>
                <select multiple name="domainesIds" value={formData.domainesIds} onChange={handleInputChange} className="multi-select">
                    {domains.map(d => (
                        <option key={d.id} value={d.id}>{d.nom}</option>
                    ))}
                </select>
                <small>Maintenez Ctrl pour sélectionner plusieurs domaines</small>
            </div>
            <div className="form-group">
                <label>Fichier PDF</label>
                <div className="file-input-wrapper">
                    <input type="file" name="fichier" accept=".pdf" onChange={handleInputChange} id="file-upload" />
                    <label htmlFor="file-upload" className="file-label">
                        {filePreview || 'Choisir un fichier PDF'}
                    </label>
                </div>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {initialData ? 'Mettre à jour' : 'Publier'}
                </button>
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default PublicationForm;
