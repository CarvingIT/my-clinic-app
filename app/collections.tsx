import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Collection {
    id: string;
    name: string;
    itemCount: number;
    iconName: keyof typeof Ionicons.glyphMap;
    accent: string;
    bg: string;
}

const DUMMY_COLLECTIONS: Collection[] = [
    { id: '1', name: 'Financial Reports', itemCount: 24, iconName: 'bar-chart', accent: '#0ea5e9', bg: '#f0f9ff' },
    { id: '2', name: 'Legal Documents', itemCount: 13, iconName: 'document-text', accent: '#8b5cf6', bg: '#f5f3ff' },
    { id: '3', name: 'HR Policies', itemCount: 8, iconName: 'people', accent: '#ec4899', bg: '#fdf2f8' },
    { id: '4', name: 'Product Specs', itemCount: 31, iconName: 'construct', accent: '#f59e0b', bg: '#fffbeb' },
    { id: '5', name: 'Marketing Assets', itemCount: 47, iconName: 'megaphone', accent: '#ef4444', bg: '#fef2f2' },
    { id: '6', name: 'Engineering Docs', itemCount: 19, iconName: 'code-slash', accent: '#10b981', bg: '#f0fdf4' },
    { id: '7', name: 'Research Papers', itemCount: 6, iconName: 'flask', accent: '#6366f1', bg: '#eef2ff' },
    { id: '8', name: 'Client Contracts', itemCount: 11, iconName: 'briefcase', accent: '#f97316', bg: '#fff7ed' },
];

export default function CollectionsScreen() {
    const router = useRouter();

    const totalDocs = DUMMY_COLLECTIONS.reduce((s, c) => s + c.itemCount, 0);

    const renderItem = ({ item }: { item: Collection }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: item.bg, borderLeftColor: item.accent }]}
            onPress={() => router.push('/documents')}
            activeOpacity={0.85}
        >
            <View style={[styles.iconWrap, { backgroundColor: item.accent }]}>
                <Ionicons name={item.iconName} size={22} color="#fff" />
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.collectionName}>{item.name}</Text>
                <View style={styles.countRow}>
                    <Ionicons name="document-outline" size={12} color={item.accent} style={{ marginRight: 4 }} />
                    <Text style={[styles.docCount, { color: item.accent }]}>{item.itemCount} documents</Text>
                </View>
            </View>
            <View style={[styles.arrowWrap, { backgroundColor: item.accent + '20' }]}>
                <Ionicons name="chevron-forward" size={18} color={item.accent} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={14} color="#64748b" />
                    <Text style={styles.backLabel}>INSTANCES</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <View style={styles.headerIconWrap}>
                        <Ionicons name="folder-open" size={20} color="#3b82f6" />
                    </View>
                    <Text style={styles.headerTitle}>Collections</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    {DUMMY_COLLECTIONS.length} collections · {totalDocs} total documents
                </Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                {[
                    { label: 'Collections', value: String(DUMMY_COLLECTIONS.length), icon: 'folder' as const },
                    { label: 'Total Docs', value: String(totalDocs), icon: 'documents' as const },
                    { label: 'Last Synced', value: 'Just now', icon: 'time' as const },
                ].map(stat => (
                    <View key={stat.label} style={styles.statCard}>
                        <Ionicons name={stat.icon} size={16} color="#3b82f6" style={{ marginBottom: 4 }} />
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            <FlatList
                data={DUMMY_COLLECTIONS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#f1f5f9' },

    // Header
    header: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 20,
        paddingTop: 44,
        paddingBottom: 22,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    backLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748b',
        letterSpacing: 2,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    headerIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#1e3a5f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#f8fafc',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
        marginLeft: 56,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 18,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    statValue: { fontSize: 16, fontWeight: '800', color: '#f8fafc' },
    statLabel: { fontSize: 10, color: '#64748b', marginTop: 2, fontWeight: '600', letterSpacing: 0.5 },

    // List
    listContent: { padding: 16, paddingBottom: 32 },

    // Card
    card: {
        borderRadius: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 4,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    cardBody: { flex: 1 },
    collectionName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 5,
    },
    countRow: { flexDirection: 'row', alignItems: 'center' },
    docCount: { fontSize: 12, fontWeight: '600' },
    arrowWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
