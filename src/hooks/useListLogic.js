import { useState, useEffect, useMemo } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { useSearch } from '../components/contexts/SearchContext';
import { FaCheck, FaGamepad, FaList, FaPause, FaQuestion, FaTrashAlt } from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';

const useListLogic = (list, { editable = false, onReorderList = null } = {}) => {
    const [mutableList, setMutableList] = useState(list);
    const [activeTab, setActiveTab] = useState('Finished');

    const { searchString } = useSearch();

    const [sortingCache, setSortingCache] = useState(['order', 'default']);
    const [isSorted, setIsSorted] = useState(false);
    const [isFilteredSearch, setIsFilteredSearch] = useState(false);

    const [activeId, setActiveId] = useState(null);
    const [dragGame, setDragGame] = useState({});

    const listCategories = [
        { key: "All", label: "ALL GAMES", icon: FaList, filter: () => true },
        { key: "Finished", label: "COMPLETED", icon: FaCheck, filter: game => game.playstatus === "finished"},
        { key: "Playing", label: "PLAYING", icon: FaGamepad, filter: game => game.playstatus === "playing" },
        { key: "OnHold", label: "ON HOLD", icon: FaPause, filter: game => game.playstatus === "onhold" },
        { key: "Dropped", label: "DROPPED", icon: FaTrashAlt, filter: game => game.playstatus === "dropped"},
        { key: "Other", label: "OTHER", icon: FaQuestion, filter: game => game.playstatus === "other" },
        { key: "PlanToPlay", label: "PLAN TO PLAY", icon: FaListCheck, filter: game => game.playstatus === "plantoplay"}
    ];

    useEffect(() => {
        setMutableList(getFilteredSortedList());
    }, [list, searchString, sortingCache, activeTab]);

    function getFilteredSortedList() {
        let updatedList = [...list];

        const activeCategory = listCategories.find(cat => cat.key === activeTab);
        if (activeCategory) {
        updatedList = updatedList.filter(activeCategory.filter);
        }

        const hasSearch = searchString.trim() !== '';
        if (hasSearch) {
        updatedList = filterBySearchString(updatedList);
        setIsFilteredSearch(true);
        } else {
        setIsFilteredSearch(false);
        }

        const shouldSort = editable ? isSorted : sortingCache[1] !== 'default';
        if (shouldSort) {
        updatedList.sort(sortByProperty(sortingCache[0], sortingCache[1]));
        }

        return updatedList;
    }

    function filterBySearchString(list) {
        const normalizedSearch = searchString
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

        return list.filter(game =>
        game.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(normalizedSearch)
        );
    }

    function sortByProperty(property, way) {
        const sortOrder = way === 'desc' ? -1 : 1;

        switch (property) {
        case 'title':
            return (a, b) => a.title.localeCompare(b.title) * sortOrder;
        case 'platform':
            return (a, b) => a.platform.name.localeCompare(b.platform.name) * sortOrder;
        case 'playtime':
            return (a, b) =>
            (parseFloat(a.playtime.replace(',', '.')) - parseFloat(b.playtime.replace(',', '.'))) * sortOrder;
        case 'rating':
            const ratingSum = arr => arr.reduce((sum, r) => sum + r, 0);
            return (a, b) => (ratingSum(a.rating) - ratingSum(b.rating)) * sortOrder;
        default:
            return () => 1;
        }
    }

    function handleSort(property) {
        if (sortingCache[0] === property) {
            if (sortingCache[1] === 'asc') {
                setSortingCache([property, 'desc']);
                if (editable) setIsSorted(true);
            } else {
                setSortingCache(['order', 'default']);
                if (editable) setIsSorted(false);
            }
        } else {
            setSortingCache([property, 'asc']);
            if (editable) setIsSorted(true);
        }
    }

    function handleChangeIndex(id, newIndex) {
        const oldIndex = list.findIndex(game => game.id === id);
        const correctedNewIndex = list.findIndex(game => game.id === mutableList[newIndex - 1]?.id);

        const newList = arrayMove(list, oldIndex, correctedNewIndex);
        setMutableList(arrayMove(mutableList, oldIndex, correctedNewIndex));

        if (onReorderList) {
        onReorderList(newList);
        }
    }

    const listCategoriesWithCounts = useMemo(() => {
        return listCategories.map(cat => {
        const filtered = filterBySearchString(list.filter(cat.filter));
        return {
            ...cat,
            label: isFilteredSearch ? `${cat.label} (${filtered.length})` : cat.label,
        };
        });
    }, [list, searchString, isFilteredSearch]);

    const handleDragStart = (event) => {
        setDragGame(list.find(game => game.id === event.active.id));
        setActiveId(event.active.id);
        };

    const handleDragEnd = (event) => {
        if (!isSorted && !isFilteredSearch) {
            const { active, over } = event;
            if (active && over && active.id !== over.id) {
                const oldIndex = list.findIndex(game => game.id === active.id);
                const newIndex = list.findIndex(game => game.id === over.id);
                const reorderedList = arrayMove(list, oldIndex, newIndex);
                setMutableList(arrayMove(mutableList, oldIndex, newIndex));
                onReorderList && onReorderList(reorderedList);
            }
        }
    };

  return {
    mutableList,
    setMutableList,
    activeTab,
    setActiveTab,
    sortingCache,
    setSortingCache,
    isSorted,
    isFilteredSearch,
    searchString,
    handleSort,
    handleChangeIndex,
    listCategoriesWithCounts,
    handleDragStart,
    handleDragEnd
  };
};

export default useListLogic;
