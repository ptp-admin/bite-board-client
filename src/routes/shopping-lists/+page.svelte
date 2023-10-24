<script lang="ts">
	import type { ShoppingList } from '../../../types/data';
    import type { PageData } from './$types';
    
    export let data: PageData;
    const shoppingLists: ShoppingList[] = data.shoppingLists
    console.log(shoppingLists);
    
</script>