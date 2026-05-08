import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import researcherService from '../services/researcher.service.js';
import MyPublications from './dashboard/MyPublications';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [researcher, setResearcher] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResearcher = async () => {
            if (user?.id) {
                try {
                    const data = await researcherService.getByUserId(user.id);
                    setResearcher(data);
                } catch (error) {
                    console.log('Aucun profil chercheur associé');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchResearcher();
    }, [user]);

    if (loading) return <div className="loader">Chargement...</div>;

    return (
        <motion.div 
            className="dashboard container" 
            style={{ paddingTop: 'calc(var(--navbar-h, 70px) + 32px)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h1>Tableau de bord</h1>
            <p>Bienvenue, {user?.prenom} {user?.nom} !</p>

            <div className="tab-content" style={{ marginTop: '2rem' }}>
                {researcher ? (
                    <MyPublications chercheurId={researcher.id} />
                ) : (
                    <div className="no-profile-message">
                        <p>Votre compte n'est pas encore totalement configuré comme chercheur.</p>
                        <p>Veuillez contacter un administrateur pour l'activation initiale de votre profil.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Dashboard;