import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    StatusBar,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Instance {
    id: string;
    name: string;
    baseUrl: string;
}

const DUMMY_INSTANCES: Instance[] = [
    { id: '1', name: 'Production Repo', baseUrl: 'https://repo.prod.example.com' },
    { id: '2', name: 'Staging Repo', baseUrl: 'https://repo.staging.example.com' },
    { id: '3', name: 'Dev Repo', baseUrl: 'https://repo.dev.example.com' },
    { id: '4', name: 'QA Repository', baseUrl: 'https://repo.qa.example.com' },
];

const AVATAR_COLORS = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed'];
const getAvatarColor = (name: string) =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ─── Modal Form ───────────────────────────────────────────────────────────────
interface InstanceFormModalProps {
    visible: boolean;
    mode: 'add' | 'edit';
    initial: { name: string; baseUrl: string };
    onSave: (name: string, baseUrl: string) => void;
    onClose: () => void;
}

function InstanceFormModal({ visible, mode, initial, onSave, onClose }: InstanceFormModalProps) {
    const [name, setName] = useState(initial.name);
    const [baseUrl, setBaseUrl] = useState(initial.baseUrl);
    const [nameError, setNameError] = useState('');
    const [urlError, setUrlError] = useState('');

    React.useEffect(() => {
        setName(initial.name);
        setBaseUrl(initial.baseUrl);
        setNameError('');
        setUrlError('');
    }, [visible, initial.name, initial.baseUrl]);

    const validate = () => {
        let valid = true;
        if (!name.trim()) { setNameError('Instance name is required.'); valid = false; }
        else setNameError('');
        if (!baseUrl.trim()) { setUrlError('Base URL is required.'); valid = false; }
        else if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            setUrlError('URL must start with http:// or https://'); valid = false;
        } else setUrlError('');
        return valid;
    };

    const handleSave = () => { if (validate()) onSave(name.trim(), baseUrl.trim()); };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
                <View style={styles.modalCard}>
                    {/* Handle */}
                    <View style={styles.modalHandle} />

                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.modalIconWrap}>
                            <Ionicons
                                name={mode === 'add' ? 'add-circle' : 'create'}
                                size={28}
                                color="#3b82f6"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.modalTitle}>
                                {mode === 'add' ? 'Add New Instance' : 'Edit Instance'}
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                {mode === 'add'
                                    ? 'Connect a new Smart Repository instance.'
                                    : 'Update the details of this instance.'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                            <Ionicons name="close" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
                        {/* Name Field */}
                        <Text style={styles.fieldLabel}>
                            Instance Name <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputRow, nameError ? styles.inputRowError : null]}>
                            <Ionicons name="server-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.fieldInput}
                                placeholder="e.g. Production Repo"
                                placeholderTextColor="#adb5bd"
                                value={name}
                                onChangeText={t => { setName(t); setNameError(''); }}
                                returnKeyType="next"
                            />
                        </View>
                        {nameError ? (
                            <View style={styles.errorRow}>
                                <Ionicons name="alert-circle" size={13} color="#ef4444" />
                                <Text style={styles.errorText}>{nameError}</Text>
                            </View>
                        ) : null}

                        {/* URL Field */}
                        <Text style={[styles.fieldLabel, { marginTop: 18 }]}>
                            Base URL <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputRow, urlError ? styles.inputRowError : null]}>
                            <Ionicons name="link-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.fieldInput}
                                placeholder="https://repo.example.com"
                                placeholderTextColor="#adb5bd"
                                value={baseUrl}
                                onChangeText={t => { setBaseUrl(t); setUrlError(''); }}
                                keyboardType="url"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="done"
                                onSubmitEditing={handleSave}
                            />
                        </View>
                        {urlError ? (
                            <View style={styles.errorRow}>
                                <Ionicons name="alert-circle" size={13} color="#ef4444" />
                                <Text style={styles.errorText}>{urlError}</Text>
                            </View>
                        ) : null}

                        {/* Actions */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Ionicons
                                    name={mode === 'add' ? 'add' : 'checkmark'}
                                    size={18}
                                    color="#fff"
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={styles.saveBtnText}>
                                    {mode === 'add' ? 'Add Instance' : 'Save Changes'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function InstancesScreen() {
    const router = useRouter();
    const [instances, setInstances] = useState<Instance[]>(DUMMY_INSTANCES);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingInstance, setEditingInstance] = useState<Instance | null>(null);

    const openAdd = () => { setModalMode('add'); setEditingInstance(null); setModalVisible(true); };
    const openEdit = (item: Instance) => { setModalMode('edit'); setEditingInstance(item); setModalVisible(true); };

    const handleSave = (name: string, baseUrl: string) => {
        if (modalMode === 'add') {
            setInstances(prev => [{ id: Date.now().toString(), name, baseUrl }, ...prev]);
        } else if (editingInstance) {
            setInstances(prev => prev.map(i => i.id === editingInstance.id ? { ...i, name, baseUrl } : i));
        }
        setModalVisible(false);
    };

    const handleDelete = (item: Instance) => {
        Alert.alert(
            'Delete Instance',
            `Remove "${item.name}" from your list?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => setInstances(prev => prev.filter(i => i.id !== item.id)) },
            ]
        );
    };

    const renderItem = ({ item }: { item: Instance }) => {
        const avatarColor = getAvatarColor(item.name);
        const initials = item.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

        return (
            <TouchableOpacity style={styles.card} onPress={() => router.push('/collections')} activeOpacity={0.88}>
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                    <Text style={styles.instanceName}>{item.name}</Text>
                    <View style={styles.urlRow}>
                        <Ionicons name="link-outline" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                        <Text style={styles.instanceUrl} numberOfLines={1}>{item.baseUrl}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Ionicons name="checkmark-circle" size={12} color="#22c55e" style={{ marginRight: 4 }} />
                        <Text style={styles.statusText}>Connected</Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => openEdit(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons name="pencil" size={15} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconBtn, styles.iconBtnDanger]}
                        onPress={() => handleDelete(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons name="trash-outline" size={15} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.headerIconWrap}>
                        <Ionicons name="server" size={20} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={styles.headerLabel}>SMART REPOSITORY</Text>
                        <Text style={styles.headerTitle}>Instances</Text>
                    </View>
                </View>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{instances.length}</Text>
                </View>
            </View>

            {/* Sub bar */}
            <View style={styles.subBar}>
                <Ionicons name="information-circle-outline" size={14} color="#64748b" style={{ marginRight: 6 }} />
                <Text style={styles.subBarText}>
                    {instances.length === 0 ? 'No instances yet' : `${instances.length} instance${instances.length > 1 ? 's' : ''} connected`}
                </Text>
            </View>

            {/* List */}
            <FlatList
                data={instances}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="server-outline" size={64} color="#cbd5e1" />
                        <Text style={styles.emptyTitle}>No Instances</Text>
                        <Text style={styles.emptyBody}>Add your first Smart Repository{'\n'}instance to get started.</Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={openAdd} activeOpacity={0.85}>
                <Ionicons name="add" size={22} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.fabText}>Add Instance</Text>
            </TouchableOpacity>

            {/* Modal */}
            <InstanceFormModal
                visible={modalVisible}
                mode={modalMode}
                initial={{ name: editingInstance?.name ?? '', baseUrl: editingInstance?.baseUrl ?? '' }}
                onSave={handleSave}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#f1f5f9' },

    // Header
    header: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 20,
        paddingTop: 44,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#1e3a5f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLabel: { fontSize: 10, fontWeight: '700', color: '#64748b', letterSpacing: 2 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#f8fafc', marginTop: 1 },
    headerBadge: {
        backgroundColor: '#3b82f6',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerBadgeText: { color: '#fff', fontSize: 17, fontWeight: '800' },

    // Sub bar
    subBar: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    subBarText: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },

    // List
    listContent: { padding: 16, paddingBottom: 110 },

    // Card
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    avatarText: { color: '#fff', fontSize: 17, fontWeight: '800' },
    cardInfo: { flex: 1, paddingRight: 8 },
    instanceName: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
    urlRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    instanceUrl: { fontSize: 12, color: '#94a3b8', flex: 1 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    statusText: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
    cardActions: { flexDirection: 'column', gap: 8 },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    iconBtnDanger: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },

    // Empty
    emptyState: { alignItems: 'center', marginTop: 90, gap: 12 },
    emptyTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
    emptyBody: { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 22 },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 28,
        left: 20,
        right: 20,
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        paddingVertical: 17,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
    fabText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },

    // Modal Overlay
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.55)' },
    modalCard: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: Platform.OS === 'ios' ? 36 : 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.10,
        shadowRadius: 20,
        elevation: 20,
    },
    modalHandle: {
        width: 40, height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12, marginBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 4,
        gap: 12,
    },
    modalIconWrap: {
        width: 48, height: 48,
        borderRadius: 14,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
    modalSubtitle: { fontSize: 12, color: '#64748b', marginTop: 3, lineHeight: 18 },
    modalCloseBtn: {
        width: 32, height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Modal Body
    modalBody: { paddingHorizontal: 20, paddingTop: 20 },
    fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, letterSpacing: 0.3 },
    required: { color: '#ef4444' },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 14,
    },
    inputRowError: { borderColor: '#ef4444', backgroundColor: '#fff5f5' },
    inputIcon: { marginRight: 10 },
    fieldInput: { flex: 1, fontSize: 15, color: '#0f172a', paddingVertical: 14 },
    errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
    errorText: { fontSize: 12, color: '#ef4444', fontWeight: '500' },

    // Modal Actions
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 28 },
    cancelBtn: {
        flex: 1, paddingVertical: 15, borderRadius: 14,
        backgroundColor: '#f1f5f9', alignItems: 'center',
        borderWidth: 1, borderColor: '#e2e8f0',
    },
    cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#64748b' },
    saveBtn: {
        flex: 2, paddingVertical: 15, borderRadius: 14,
        backgroundColor: '#3b82f6',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveBtnText: { fontSize: 15, fontWeight: '800', color: '#ffffff', letterSpacing: 0.3 },
});
