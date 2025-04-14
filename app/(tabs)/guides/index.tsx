import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGuides } from '../../../hooks/use-guides';
import { colors } from '../../../constants/colors';
import { Search, Download, BookOpen, MapPin } from 'lucide-react-native';

export default function GuidesScreen() {
  const router = useRouter();
  const { guides, isLoading, downloadGuide } = useGuides();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('הכל');

  const categories = ['הכל', 'לפני הטיול', 'במהלך הטיול', 'בריאות ובטיחות', 'ביטוח', 'מנהגים מקומיים'];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.includes(searchQuery) || 
                          guide.description.includes(searchQuery) ||
                          guide.tags.some(tag => tag.includes(searchQuery));
    
    const matchesCategory = activeCategory === 'הכל' || guide.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleGuidePress = (guideId: string) => {
    router.push(`/guides/${guideId}`);
  };

  const handleDownload = (guideId: string) => {
    downloadGuide(guideId);
  };

  const renderGuideItem = ({ item }: { item: typeof guides[0] }) => (
    <TouchableOpacity 
      style={styles.guideItem}
      onPress={() => handleGuidePress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.guideImage} />
      <View style={styles.guideContent}>
        <Text style={styles.guideTitle}>{item.title}</Text>
        <Text style={styles.guideDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.guideFooter}>
          <View style={styles.guideInfo}>
            <View style={styles.tagContainer}>
              <MapPin size={14} color={colors.textLight} />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            
            <View style={styles.tagContainer}>
              <BookOpen size={14} color={colors.textLight} />
              <Text style={styles.authorText}>מאת {item.author}</Text>
            </View>
          </View>
          
          {item.isOffline ? (
            <View style={styles.downloadedBadge}>
              <Text style={styles.downloadedText}>הורד</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => handleDownload(item.id)}
            >
              <Download size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>טוען מדריכים...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="חפש מדריכים..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textLight}
          textAlign="right"
        />
        <Search size={20} color={colors.textLight} style={styles.searchIcon} />
      </View>
      
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              activeCategory === item && styles.categoryButtonActive
            ]}
            onPress={() => setActiveCategory(item)}
          >
            <Text 
              style={[
                styles.categoryButtonText,
                activeCategory === item && styles.categoryButtonTextActive
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
      
      <FlatList
        data={filteredGuides}
        keyExtractor={(item) => item.id}
        renderItem={renderGuideItem}
        contentContainerStyle={styles.guidesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>לא נמצאו מדריכים</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.textLight,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: colors.text,
  },
  searchIcon: {
    marginLeft: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  guidesList: {
    padding: 16,
  },
  guideItem: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guideImage: {
    width: 120,
    height: '100%',
  },
  guideContent: {
    flex: 1,
    padding: 16,
  },
  guideTitle: {
    fontFamily: 'Heebo-Bold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  guideDescription: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    textAlign: 'right',
  },
  guideFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideInfo: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 12,
    color: colors.textLight,
    marginRight: 4,
  },
  authorText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 12,
    color: colors.textLight,
    marginRight: 4,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.success,
  },
  downloadedText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 12,
    color: colors.white,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});