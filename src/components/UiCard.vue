<template>
    <div
        class="card"
    >
        <div class="img-name">
            <img :src="source1" alt="Foto do artista" class="img">
            <p class="name">
                {{ artistsName }}
            </p>
        </div>
        <div class="specs">
            <ui-specs
            class="except-location"
            id="artist-debut"
            :type="types[0]"
            :content="artistsDebut"
            :class="getAnimationClass(statuses[0])"
            :style="{ backgroundColor: getBackgroundColor(statuses[0]) }"
            />  <!--Ano de Album de Estreia-->

            <ui-specs
            class="except-location"
            id="artist-members"
            :type="types[1]"
            :content="artistsMembers"
            :class="getAnimationClass(statuses[1])"
            :style="{ backgroundColor: getBackgroundColor(statuses[1]) }"
            />  <!--Membros-->

            <ui-specs 
            class="except-location"
            id="artist-popularity"
            :type="types[2]"
            :content="artistsPopularity"
            :class="getAnimationClass(statuses[2])"
            :style="{ backgroundColor: getBackgroundColor(statuses[2])}"
            />  <!--Popularidade-->

            <ui-specs 
            class="except-location"
            id="artist-gender"
            :type="types[3]"
            :content="artistsGender" 
            :class="getAnimationClass(statuses[3])" 
            :style="{ backgroundColor: getBackgroundColor(statuses[3]) }"          
            />  <!--Género-->

            <ui-specs
            class="except-location"
            id="artist-genre"
            :type="types[4]"
            :content="artistsGenre"
            :class="getAnimationClass(statuses[4])"
            :style="{ backgroundColor: getBackgroundColor(statuses[4]) }"
            />  <!--Tipo-->

            <div 
                class="spec" 
                id="artist-region"
                :class="getAnimationClass(statuses[5])"
                :style="{ backgroundColor: getBackgroundColor(statuses[5]) }"
            >  <!--Local de Nascença-->
                <img :src="source2" alt="Local de Nascença">
                <p class="spec-content" id="artist-place">
                    {{ artistsPlace }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>

import UiSpecs from '@/components/UiSpecs.vue';

export default {
    components: {
        UiSpecs
    },
    props: {
        source1: {
            type: String,
            default: '',
        },
        artistsName: {
            type: String,
            default: '',
        },
        artistsDebut: {
            type: String,
            default: '',
        },
        artistsMembers: {
            type: String,
            default: '',
        },
        artistsPopularity: {
            type: String,
            default: '',
        },
        artistsGender: {
            type: String,
            default: '',
        },
        artistsGenre: {
            type: String,
            default: '',
        },
        source2: {
            type: String,
            default: '',
        },
        artistsPlace: {
            type: String,
            default: '',
        },
        statuses: {
            type: Array,
            required: true,
            validator(value) {
                return value.length === 6 && value.every(v => [1, 2, 3].includes(v));
            }
        }
    },
    methods: {
        getAnimationClass(status) {
            switch (status) {
                case 1:
                    return 'not-correct-animation';
                case 2:
                    return 'almost-correct-animation';
                case 3:
                    return 'correct-animation';
                default:
                    return '';
            }
        },
        getBackgroundColor(status) {
            if (status === 3) {
                return 'rgba(34, 140, 34, 0.8)';  //Green
            } else if (status === 2) {
                return 'rgba(253, 176, 2, 0.7)'; //Yellow
            }
            return 'rgba(102, 110, 124, 0.65)'; //Same color with less opacity
        }
    },
    data() {
        return {
            types: [
                "Estreia",
                "Membros",
                "Ouvintes",
                "Género",
                "Tipo",
                "Local de Nascença"
            ],
        }
    }
}

</script>
