import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Document {
    id: string;
    title: string;
    type: string;
    size: string;
    date: string;
    author: string;
}

const FILTER_OPTIONS = ['All', 'PDF', 'Word', 'Excel', 'Image', 'Other'];

type DocMeta = {
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
    bg: string;
};

const DOC_META: Record<string, DocMeta> = {
    PDF: { iconName: 'document', color: '#dc2626', bg: '#fef2f2' },
    Word: { iconName: 'document-text', color: '#2563eb', bg: '#eff6ff' },
    Excel: { iconName: 'grid', color: '#16a34a', bg: '#f0fdf4' },
    Image: { iconName: 'image', color: '#7c3aed', bg: '#f5f3ff' },
    Other: { iconName: 'attach', color: '#d97706', bg: '#fffbeb' },
};

const FILTER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    All: 'layers-outline',
    PDF: 'document',
    Word: 'document-text',
    Excel: 'grid',
    Image: 'image',
    Other: 'attach',
};

const DUMMY_DOCUMENTS: Document[] = [
    { id: '1', title: 'Q4 Financial Summary 2024', type: 'PDF', size: '2.3 MB', date: '12 Feb 2025', author: 'Priya S.' },
    { id: '2', title: 'Employee Handbook v3', type: 'Word', size: '1.1 MB', date: '08 Jan 2025', author: 'Rahul M.' },
    { id: '3', title: 'Sales Pipeline Analysis', type: 'Excel', size: '450 KB', date: '15 Feb 2025', author: 'Ananya K.' },
    { id: '4', title: 'Product Roadmap Diagram', type: 'Image', size: '3.7 MB', date: '03 Feb 2025', author: 'Dev T.' },
    { id: '5', title: 'Service Level Agreement', type: 'PDF', size: '890 KB', date: '20 Jan 2025', author: 'Suresh P.' },
    { id: '6', title: 'Team Meeting Notes — Feb', type: 'Word', size: '320 KB', date: '10 Feb 2025', author: 'Meera A.' },
    { id: '7', title: 'Budget Allocation Sheet', type: 'Excel', size: '600 KB', date: '01 Feb 2025', author: 'Vikram R.' },
    { id: '8', title: 'Brand Guidelines 2025', type: 'PDF', size: '5.2 MB', date: '14 Jan 2025', author: 'Nisha G.' },
    { id: '9', title: 'API Integration Reference', type: 'Other', size: '280 KB', date: '09 Feb 2025', author: 'Arjun L.' },
    { id: '10', title: 'Office Floor Plan', type: 'Image', size: '1.8 MB', date: '22 Jan 2025', author: 'Kavya B.' },
];

export default function DocumentsScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredDocs = DUMMY_DOCUMENTS.filter(doc => {
        const matchFilter = activeFilter === 'All' || doc.type === activeFilter;
        const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const renderItem = ({ item }: { item: Document }) => {
        const meta = DOC_META[item.type] ?? DOC_META['Other'];
        return (
            <TouchableOpacity style={styles.docCard} activeOpacity={0.85}>
                <View style={[styles.docIconWrap, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.iconName} size={24} color={meta.color} />
                </View>
                <View style={styles.docBody}>
                    <Text style={styles.docTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.docMetaRow}>
                        <View style={[styles.typePill, { backgroundColor: meta.bg }]}>
                            <Ionicons name={meta.iconName} size={10} color={meta.color} style={{ marginRight: 3 }} />
                            <Text style={[styles.typePillText, { color: meta.color }]}>{item.type}</Text>
                        </View>
                        <Ionicons name="ellipse" size={4} color="#cbd5e1" style={{ marginHorizontal: 4 }} />
                        <Ionicons name="scale-outline" size={11} color="#94a3b8" style={{ marginRight: 3 }} />
                        <Text style={styles.metaSmall}>{item.size}</Text>
                        <Ionicons name="ellipse" size={4} color="#cbd5e1" style={{ marginHorizontal: 4 }} />
                        <Ionicons name="calendar-outline" size={11} color="#94a3b8" style={{ marginRight: 3 }} />
                        <Text style={styles.metaSmall}>{item.date}</Text>
                    </View>
                    <View style={styles.authorRow}>
                        <Ionicons name="person-circle-outline" size={13} color="#94a3b8" style={{ marginRight: 4 }} />
                        <Text style={styles.docAuthor}>{item.author}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-vertical" size={18} color="#cbd5e1" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={14} color="#64748b" />
                    <Text style={styles.backLabel}>COLLECTIONS</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <View style={styles.headerIconWrap}>
                        <Ionicons name="documents" size={20} color="#3b82f6" />
                    </View>
                    <Text style={styles.headerTitle}>Documents</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    {filteredDocs.length} of {DUMMY_DOCUMENTS.length} documents
                </Text>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color="#64748b" style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search documents..."
                        placeholderTextColor="#64748b"
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
                            <Ionicons name="close-circle" size={18} color="#64748b" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filters */}
            <View style={styles.filterWrap}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersRow}
                >
                    {FILTER_OPTIONS.map(f => {
                        const isActive = activeFilter === f;
                        const meta = DOC_META[f];
                        const iconName = FILTER_ICONS[f];
                        return (
                            <TouchableOpacity
                                key={f}
                                style={[
                                    styles.chip,
                                    isActive && { backgroundColor: meta?.color ?? '#0f172a', borderColor: meta?.color ?? '#0f172a' },
                                ]}
                                onPress={() => setActiveFilter(f)}
                            >
                                <Ionicons
                                    name={iconName}
                                    size={13}
                                    color={isActive ? '#fff' : (meta?.color ?? '#64748b')}
                                    style={{ marginRight: 5 }}
                                />
                                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* List */}
            <FlatList
                data={filteredDocs}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={56} color="#cbd5e1" />
                        <Text style={styles.emptyTitle}>No Documents Found</Text>
                        <Text style={styles.emptyBody}>Try adjusting your search or filter.</Text>
                    </View>
                }
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
        fontSize: 11, fontWeight: '700', color: '#64748b', letterSpacing: 2,
    },
    headerTitleRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4,
    },
    headerIconWrap: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: '#1e3a5f',
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#f8fafc' },
    headerSubtitle: { fontSize: 13, color: '#94a3b8', marginLeft: 56 },

    // Search
    searchWrap: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 16,
        paddingBottom: 14,
        paddingTop: 4,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    searchInput: { flex: 1, fontSize: 15, color: '#f8fafc' },
    clearBtn: { paddingLeft: 8 },

    // Filters
    filterWrap: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    filtersRow: {
        paddingHorizontal: 14, paddingVertical: 12, gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
    },
    chipText: { fontSize: 13, fontWeight: '600', color: '#475569' },
    chipTextActive: { color: '#ffffff' },

    // List
    listContent: { padding: 16, paddingBottom: 32 },

    // Doc Card
    docCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    docIconWrap: {
        width: 50, height: 50, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 14,
    },
    docBody: { flex: 1 },
    docTitle: {
        fontSize: 14, fontWeight: '700', color: '#0f172a',
        lineHeight: 20, marginBottom: 6,
    },
    docMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    typePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 6,
    },
    typePillText: { fontSize: 11, fontWeight: '700' },
    metaSmall: { fontSize: 11, color: '#94a3b8' },
    authorRow: { flexDirection: 'row', alignItems: 'center' },
    docAuthor: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic' },
    moreBtn: {
        paddingLeft: 8,
        paddingTop: 2,
        width: 32,
        alignItems: 'center',
    },

    // Empty
    emptyState: { alignItems: 'center', marginTop: 80, gap: 12 },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
    emptyBody: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
});
