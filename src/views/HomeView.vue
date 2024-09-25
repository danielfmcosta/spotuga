<template>
  <div id="app">
    <main> 
      <div class="header">  
        <!-- <l-line-wobble
          class="wobble"
          size="5000"
          stroke="5"
          bg-opacity="0"
          speed="4" 
          color="white" 
        ></l-line-wobble> -->
        <ui-button class="homeButton"
          to="home"
        />
        <ui-button class="infoButton"
          icon="fa-solid fa-question"
          to="InfoSpotuga"
        />
        <div 
          class="volumeControl"
          @mouseover="expandSlider"
          @mouseleave="shrinkSlider"
        >
          <ui-button class="volumeButton"
            :icon="volumeIcon"
            @click="toggleMute"
          />
          <transition name="slider-expand">
            <div
              class="volumeSlider"
              v-if="sliderVisible"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model="volume"
                @input="updateVolume"
              >
            </div>
          </transition>
        </div>
      </div>

      <transition name="show-answer" >
        <div class="answer" v-if = "(guessedRight || ranOutGuess) && showAnswer  && ready">
          <p class="rightOrWrong">
            {{ guessedRight ? "Parabéns! Adivinhaste!" : ranOutGuess ? "Acabaram-se as tentativas!" : "" }}
          </p>
          <button
            @click="showAnswer=false"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
          <img :src="this.todayArtistDetails.image" alt="Foto do artista" class="answer-img">
          <span class="artistOfTheDayName">{{ this.todayArtist }}</span>
          <p class="countdown">
            Próximo Spotuga
          </p>
          <span class="countdown">
            {{ timeUntilMidnight }}
          </span>
        </div>
      </transition>

      <div :class="{ fuzzy: (guessedRight || ranOutGuess) && showAnswer }" class="centerConsole">
        <p class="counter">
            Adivinhou {{ numGuess  }} de 10
        </p>
        <div class="search-container" >
          <ui-input
            class="search-input"
            placeholder="Advinha um artista"
            v-model.trim="guess"
            @keyup.enter="submitGuess"
            @input="showAutocompleteList"
            @focus="showAutocompleteList"
            :disabled="guessedRight || ranOutGuess"
          />
          <button 
            class="search-emoji" 
            @click="submitGuess"
            :disabled="guessedRight">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <transition name="show-autocomplete">
          <div class="autocomplete" v-if="showAutocomplete && filteredArtists.length">
            <div
              v-for="suggestedArtist in filteredArtists"
              :key="suggestedArtist"
              @click="selectSuggestedArtist(suggestedArtist)"
              class="autocomplete-item"
            >
              {{  suggestedArtist }}
            </div>
          </div>
        </transition>
        <div 
          v-for="(artist) in this.artistsGuessed"
          :key="artist.id"
        >
          <ui-card
            :source1="artist.image"
            :artistsName="artist.name"
            :artistsDebut="artist.YDA"
            :artistsMembers="artist.members"
            :artistsPopularity="artist.popularity"
            :artistsGender="artist.gender"
            :artistsGenre="artist.genre"
            :source2="`../imagens/${artist.region}.png`"
            :artistsPlace="artist.region"
            :statuses="artist.statuses"
          />
        </div>
      </div>
      <div class="example" v-if="showExample">
        <p>
          Boas-vindas ao <span>Spotuga</span><br>
          Baseado no jogo <a href="https://spotle.io/" target="_blank">Spotle</a>, com uma exceção, <br>
          só existem artistas portugueses.
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import UiButton from '@/components/UiButton.vue';
import UiCard from '@/components/UiCard.vue';
import UiInput from '@/components/UiInput.vue';

import axios from 'axios';
import { CLIENT_SECRET, CLIENT_ID} from '../../config';
// import { lineWobble } from 'ldrs'

// lineWobble.register()



export default {
  components: {
    UiButton,
    UiInput,
    UiCard,
  },
  data() {
    return {
      timeUntilMidnight: '',

      showAnswer: true,
      ready: false,

      guess: "", //artist guessed
      artist: {}, //artist object
      artistAux: {}, //artist auxiliary with all parameters
      
      todayArtist: null, //artist of today Name
      todayArtistDetails: null, //details of the artist of today
      todayArtistSong: null, //song of the artist of today

      artistTrack: null, //artist top track

      artistsGuessed: [],
      artistsGuessedAux: [],
      artistsName: [ //holds the names of all the artists
        "4Taste",
        "9 Miller",
        "A Naifa",
        "Adelaide Ferreira",
        "Adolfo Luxúria Canibal",
        "Adriano Correia de Oliveira",
        "Afonso Dias",
        "Agir",
        "Ala dos Namorados",
        "Alberto Ribeiro",
        "Alexander Search",
        "Alfredo Marceneiro",
        "Amália Rodrigues",
        "Amélia Muge",
        "Amor Electro",
        "Ana da Silva",
        "Ana Free",
        "Ana Malhoa",
        "Ana Moura",
        "Anabela",
        "Anarchicks",
        "André Sardet",
        "Anita Guerreiro",
        "António Calvário",
        "António Rocha",
        "António Sala",
        "António Variações",
        "António Zambujo",
        "April Ivy",
        "Aqui d'El-Rock",
        "Aragão",
        "Argentina Santos",
        "Aurea",
        "Ava Inferi",
        "Banda do Casaco",
        "Bárbara Bandeira",
        "Bárbara Tinoco",
        "Beatriz da Conceição",
        "Beautify Junkyards",
        "Best Youth",
        "Beto",
        "Bispo",
        "Bizarra Locomotiva",
        "Blasted Mechanism",
        "Blaya",
        "Blind Zero",
        "Boss AC",
        "Brigada Victor Jara",
        "Buba Espinho",
        "Buraka Som Sistema",
        "Calema",
        "Camané",
        "Cândida Branca Flor",
        "Capicua",
        "Capitão Fausto",
        "Carla Prata",
        "Carlão",
        "Carlos do Carmo",
        "Carlos Mendes",
        "Carlos Nóbrega",
        "Carlos Paião",
        "Carlos Paredes",
        "Carlos Quintas",
        "Carmen Miranda",
        "Carmen Souza",
        "Carminho",
        "Carolina Cardetas",
        "Carolina Deslandes",
        "Celeste Rodrigues",
        "Chico da Tina",
        "Clã",
        "Cláudia Pascoal",
        "Claudisabel",
        "Conan Osiris",
        "Cool Hipnoise",
        "Corvos",
        "Cristina Branco",
        "Cuca Roseta",
        "D.A.M.A",
        "D'ZRT",
        "Da Vinci",
        "Da Weasel",
        "Dæmonarch",
        "DarkWaters",
        "David Carreira",
        "David Fonseca",
        "Dazkarieh",
        "Dead Combo",
        "Dealema",
        "Deedz B",
        "Deejay Telio",
        "Deezy",
        "Delfins",
        "Dengaz",
        "Deolinda",
        "Diana Lucas",
        "Dillaz",
        "Dino D'Santiago",
        "Diogo Piçarra",
        "Doce",
        "Domingues",
        "Dora",
        "Dulce Pontes",
        "Easyway",
        "Eduardo Nascimento",
        "Elisa",
        "Ercília Costa",
        "Eugénia Melo e Castro",
        "Excesso",
        "Expensive Soul",
        "Fernando Daniel",
        "Fernando Machado Soares",
        "Fernando Maurício",
        "Fernando Ribeiro",
        "Fernando Tordo",
        "Filipa Azevedo",
        "Filipa Sousa",
        "Filipe Pinto",
        "Fingertips",
        "Fínix MG",
        "Flor-de-Lis",
        "Fonzie",
        "FRANKIEONTHEGUITAR",
        "G-Amado",
        "Gama WNTD",
        "Ganso",
        "General D",
        "Gisela João",
        "GNR",
        "GROGNation",
        "Gson",
        "Halloween",
        "Hands on Approach",
        "Helder Moutinho",
        "Herman José",
        "Hermínia Silva",
        "Heróis do Mar",
        "Holly Hood",
        "Holocausto Canibal",
        "Holy Nothing",
        "Humanos",
        "Hyubris",
        "IAMDDB",
        "Icon & The Black Roses",
        "If Lucy Fell",
        "Inês Herédia",
        "Isaura",
        "Ivandro",
        "João Borsch",
        "João Maia Ferreira",
        "João Pedro Pais",
        "João Pequeno",
        "Joao So E Abandonados",
        "Jorge Palma",
        "José Afonso",
        "José Cid",
        "José Malhoa",
        "José Mário Branco",
        "José Pinhal",
        "JP Simões",
        "Julinho Ksd",
        "Just Girls",
        "Karetus",
        "Kátia Aveiro",
        "Katia Guerreiro",
        "Lata Gouveia",
        "Legendary Tigerman",
        "Lena d'Água",
        "Leonor Andrade",
        "Lhast",
        "Linda de Suza",
        "Linda Martini",
        "Lon3r Johny",
        "Lúcia Moniz",
        "Luciana Abreu",
        "Lucília do Carmo",
        "Luís Goes",
        "Luísa Basto",
        "Luísa Sobral",
        "Lula Pena",
        "Lura",
        "Madalena Iglésias",
        "Madredeus",
        "Mafalda Arnauth",
        "Mafalda Veiga",
        "Manuel Freire",
        "Manuela Azevedo",
        "Manuela Bravo",
        "Mão Morta",
        "Mara Abrantes",
        "Maria de Vasconcelos",
        "Maria João",
        "Maria José Valério",
        "Maria Teresa de Noronha",
        "Mariana Bandhold",
        "Mariza",
        "Maro",
        "Marta Dias",
        "Mazgani",
        "Mickael Carreira",
        "Micro Audio Waves",
        "Miguel Araújo",
        "Miguel Gameiro",
        "Mimicat",
        "Mishlawi",
        "Mísia",
        "Mizzy Miles",
        "Monica Sintra",
        "Moonspell",
        "Mundo Secreto",
        "Murta",
        "Nelly Furtado",
        "Nena",
        "Nenny",
        "Nico Paulo",
        "Nininho Vaz Maia",
        "Norton",
        "Nucha",
        "Nuno Bettencourt",
        "Oliver Sean",
        "Orelha Negra",
        "Ornatos Violeta",
        "Os Azeitonas",
        "Os Quatro e Meia",
        "Paco Bandeira",
        "Padre José Luís Borga",
        "Papillon",
        "Paranormal Attack",
        "Patrícia Candoso",
        "Patricia Ribeiro",
        "Paulo Alexandre",
        "Paulo Brissos",
        "Paulo de Carvalho",
        "Paulo Flores",
        "Paulo Gonzo",
        "PAUS",
        "Pedro Abrunhosa",
        "Pedro Madeira",
        "Per7ume",
        "Pilar Homem de Melo",
        "Piruka",
        "Plutónio",
        "Pólo Norte",
        "ProfJam",
        "Quarteto 1111",
        "Quim Barreiros",
        "Quinta do Bill",
        "Raquel Camarinha",
        "Raquel Tavares",
        "Richie Campbell",
        "Rita Guerra",
        "Rita Redshoes",
        "Rita Rocha",
        "Roberto Leal",
        "Rosinha",
        "Rouxinol Faduncho",
        "Rui Bandeira",
        "Rui Drumond",
        "Rui Reininho",
        "Rui Veloso",
        "Salvador Sobral",
        "Sam the Kid",
        "Santamaria",
        "Sara Correia",
        "Sara Serpa",
        "Sara Tavares",
        "Scar for Life",
        "Sean Riley & The Slowriders",
        "Sérgio Godinho",
        "Sétima Legião",
        "Silence 4",
        "SippinPurpp",
        "Slimmy",
        "Slow J",
        "Sofia Hoffmann",
        "Stealing Orchestra",
        "Susana Félix",
        "T-Rex",
        "Tara Perdida",
        "Tarantula",
        "Taxi",
        "Teresa Salgueiro",
        "Teresinha Landeiro",
        "The Act-Ups",
        "The Black Mamba",
        "The Gift",
        "The Lemon Lovers",
        "The Parkinsons",
        "Tiago Bettencourt",
        "Tonicha",
        "Tony Carreira",
        "Toranja",
        "UHF",
        "Underground Sound of Lisbon",
        "Valete",
        "Van Zee",
        "Vânia Fernandes",
        "Vitorino",
        "WAY 45",
        "Wet Bed Gang",
        "Wraygunn",
        "X-Tense",
        "xtinto",
        "Xutos & Pontapés",
        "You Can't Win, Charlie Brown",
        "Yuri NR5",
        "Zara G",
        "Zé Amaro",
        "Zé Cabra",
      ],

      portugalDistricts: [
        "Açores",
        "Madeira",
        "Aveiro", 
        "Beja", 
        "Braga", 
        "Bragança", 
        "Castelo Branco",
        "Coimbra", 
        "Évora", 
        "Faro", 
        "Guarda", 
        "Leiria", 
        "Lisboa", 
        "Portalegre", 
        "Porto", 
        "Santarém",
        "Setúbal", 
        "Viana do Castelo", 
        "Vila Real",
        "Viseu"
      ], 

      volume: this.getVolume(),
      sliderVisible: false,
      isMuted:false,

      showAutocomplete: true, //condition to show autocomplete
      showExample: true, //condition to show example
      guessedRight: false, //condition to know when the user guessed the right artist
      ranOutGuess: false, //condition to know when the user ran out of guesses
      numGuess: this.getNumGuess(), //number of guesses

      accessToken: null, //access token from spotify
      tokenExpiry: null, //access token expiry time
    };
  },
  computed: {
    filteredArtists() {
      if (!this.guess) return [];
      
      const guessLower = this.guess.toLowerCase();

      if (this.guess.length === 1) {
        const filtered = this.artistsName.filter((artist) =>
          artist.toLowerCase().startsWith(guessLower)
        );
        return filtered.slice(0, 8);
      }
      
      const filtered = this.artistsName.filter((artist) =>
        artist.toLowerCase().includes(guessLower)
      );
      
      return filtered.slice(0, 8);
    },
    volumeIcon() {
      if (this.volume == 0) {
        return 'fa-solid fa-volume-xmark';
      } else if (this.volume > 0 && this.volume < 0.5) {
        return 'fa-solid fa-volume-low';
      } else {
        return 'fa-solid fa-volume-high';
      }
    },
  },
  methods: {
    async clearLocalStorageAtMidnight() {
      const now = new Date();
      const currentDate = now.toDateString(); 
      
      const lastClearedDate = localStorage.getItem('lastClearedDate');
      
      if (lastClearedDate !== currentDate) {
          localStorage.clear();
          localStorage.setItem('lastClearedDate', currentDate);
      }
    },
    showAutocompleteList() {
      this.showAutocomplete = true;
    },
    selectSuggestedArtist(suggestedArtist) {
      this.guess = suggestedArtist;
      !this.showAutocompleteList()
      this.submitGuess();
    },
    storeGuesses() {
      this.artistsGuessedAux.unshift(this.filteredArtists[0]);
      this.artistsGuessed.unshift(this.artist);
      this.numGuess = this.artistsGuessedAux.length;
      localStorage.setItem('numGuess', this.numGuess);
      this.showExample=false;
      localStorage.setItem('artistsGuessed', JSON.stringify(this.artistsGuessed));
      localStorage.setItem('artistsGuessedAux', JSON.stringify(this.artistsGuessedAux));
      localStorage.setItem('showExample', this.showExample)
    },
    async getLocalStorage() {
      this.artistsGuessed = JSON.parse(localStorage.getItem('artistsGuessed')) || [];
      this.artistsGuessedAux = JSON.parse(localStorage.getItem('artistsGuessedAux')) || [];
      if (JSON.parse(localStorage.getItem('showExample')) == null){
        this.showExample = true;
      }
      else {
        this.showExample = JSON.parse(localStorage.getItem('showExample'));
      }
      this.guessedRight = JSON.parse(localStorage.getItem('guessedRight')) || false;
      this.ranOutGuess = JSON.parse(localStorage.getItem('ranOutGuess')) || false;
    },
    getNumGuess() {
      if(localStorage.getItem('numGuess')){
        return localStorage.getItem('numGuess');
      } else {
        return 0;
      }
    },
    getVolume() {
      if(localStorage.getItem('volume')){
        return localStorage.getItem('volume');
      } else {
        return 0.5;
      }
    },
    toggleMute() {
      if(this.volume==0){
        this.isMuted = true
      }
      this.isMuted = !this.isMuted;
      this.volume = this.isMuted ? 0 : this.getVolume();
      this.updateVolume(); 
    },
    updateVolume() {
      localStorage.setItem('volume', this.volume);
      this.isMuted = this.volume === 0;
      if (this.audio) this.audio.volume = this.volume;
    },
    expandSlider() {
      this.sliderVisible = true;
    },
    shrinkSlider() {
      this.sliderVisible = false;
    },
    getMidnightCountdown() {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const remainingMs = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
      
      this.timeUntilMidnight = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
    },
    updateTime() {
      setInterval(() => {
        this.getMidnightCountdown();
      }, 1000);
    },
    async fetchAccessToken() { // holds the access token for the expiry duration 
      if (!this.accessToken || (this.tokenExpiry && Date.now() > this.tokenExpiry)) {
        try {
          const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

          const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
              grant_type: 'client_credentials'
            },
            headers: {
              'Authorization': `Basic ${encodedCredentials}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

          if (response.status === 200) {
            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
          } else {
            throw new Error('Failed to obtain access token');
          }
        } catch (error) {
          console.error('Error obtaining access token:', error);
          this.accessToken = null;
          this.tokenExpiry = null;
        }
      }
    },
    async fetchArtistSong(artist) {
      if (!this.accessToken) {
        console.error('No access token available');
        return;
      }

      try {
        // Step 2: Fetch the artist's top tracks using their ID (limit to the top 1 track)
        const topTracksResponse = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks`, {
          params: {
            market: 'US'  
          },
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
        if (topTracksResponse.status === 200 && topTracksResponse.data.tracks.length > 0) {
          const topTrack = topTracksResponse.data.tracks[0]; 
          console.log(topTrack);
          return topTrack;

        } else {
          throw new Error('No top tracks found for this artist');
        }
      } catch (error) {
        console.error('Error fetching artist top song:', error);
        return null;
      }
    },
    async fetchArtistDetails(artist) {
      try {
        let params = {};
        const response = await fetch(`http://127.0.0.1:5000/api/data/${artist}`);
        if (!response.ok) {
          throw new Error(`Error fetching artist details: ${response.status}`);
        }
        params = await response.json();
        console.log(params);
        return params;
      } catch (error) {
        console.error('Error fetching artist details:', error);
        return { error: 'Failed to fetch artist details' };
      }
    },
    async fetchTodayArtist() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/today_artist');
        if (response.ok) {
          const artist = await response.json();  // Parse JSON data
          this.todayArtist = artist.artist_name;
          await this.fetchAccessToken();
          this.todayArtistDetails = await this.fetchArtistDetails(artist.artist_name);
          this.todayArtistSong = await this.fetchArtistSong(this.todayArtistDetails);
        } else {
          console.error('Failed to fetch today\'s artist:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching today\'s artist:', error);
      }
    },
    async playTrack(artist) {
      if (this.audio) {
        this.audio.pause();
      }
      this.artistTrack = await this.fetchArtistSong(artist);
      if (this.artistTrack && this.artistTrack.preview_url) {
        this.audio = new Audio(this.artistTrack.preview_url);
        this.audio.volume = this.volume;
        this.audio.play();

        this.audio.addEventListener('timeupdate', () => {
          if (this.audio.currentTime >= 5) {
            this.audio.pause();
          }
        });

        this.updateVolume();
      } else {
        console.log('No preview available for this track');
      }
    },
    async formatMonthlyListeners(listeners) {
      if (listeners >= 1000000) {
        return (listeners / 1000000).toFixed(1) + 'M';
      } else if (listeners >= 1000) {
        return (listeners / 1000).toFixed(1) + 'K';
      } else {
        return listeners;
      }
    },
    async handleParams(statuses) {
        //handle YDA
        if (this.todayArtistDetails.YDA == this.artistAux.YDA) {
          statuses.push(3);
        } else if (Math.abs(this.todayArtistDetails.YDA - this.artistAux.YDA) <= 5) {
          statuses.push(2);
        } else {
          statuses.push(1);
        }
        //handle members
        if (this.todayArtistDetails.members == this.artistAux.members) {
          statuses.push(3);
        } else if (Math.abs(this.todayArtistDetails.members - this.artistAux.members) <= 1) {
          statuses.push(2);
        } else {
          statuses.push(1);
        }
        //hanlde popularity
        if (this.todayArtistDetails.popularity == this.artistAux.popularity) {
          statuses.push(3);
        } else if (Math.abs(this.todayArtistDetails.popularity - this.artistAux.popularity) <= 50000) {
          statuses.push(2);
        } else {
          statuses.push(1);
        }
        //handle gender
        if (this.todayArtistDetails.gender == this.artistAux.gender) {
          statuses.push(3);
        } else {
          statuses.push(1);
        }
        //handle genre
        if (this.todayArtistDetails.genre == this.artistAux.genre) {
          statuses.push(3);
        } else {
          statuses.push(1);
        }
        //handle region
        if (this.todayArtistDetails.region == this.artistAux.region) {
         statuses.push(3);
        } else if ((this.portugalDistricts.includes(this.todayArtistDetails.region) && this.portugalDistricts.includes(this.artistAux.region)) || (!this.portugalDistricts.includes(this.todayArtistDetails.region) && !this.portugalDistricts.includes(this.artistAux.region))) {
          statuses.push(2);
        } else {
          statuses.push(1);
        }
        return statuses;
    },
    async submitGuess() {
      if (this.filteredArtists.length > 0 && !this.artistsGuessedAux.includes(this.filteredArtists[0])) {
        this.artistAux = await this.fetchArtistDetails(this.filteredArtists[0]);
        //Just to add statuses as a param of the artist object
        const listeners = await this.formatMonthlyListeners(this.artistAux.popularity);
        this.artist = {
          image: this.artistAux.image,
          name: this.artistAux.name,
          YDA: this.artistAux.YDA + (this.artistAux.YDA == this.todayArtistDetails.YDA ? '' : (this.artistAux.YDA < this.todayArtistDetails.YDA ? ' ↑' : ' ↓')),
          members: this.artistAux.members + (this.artistAux.members == this.todayArtistDetails.members ? '' : (this.artistAux.members < this.todayArtistDetails.members ? ' ↑' : ' ↓')),
          popularity: listeners + (this.artistAux.popularity == this.todayArtistDetails.popularity ? '' : (this.artistAux.popularity < this.todayArtistDetails.popularity ? ' ↑' : ' ↓')), 
          gender: this.artistAux.gender,
          genre: this.artistAux.genre,
          region: this.artistAux.region,
          statuses: [],
        };
        this.artist.statuses = await this.handleParams(this.artist.statuses);
        await this.playTrack(this.artistAux);
        console.log(this.artistAux);
        if (this.filteredArtists[0].toLowerCase() === this.todayArtist.toLowerCase()) {
          console.log("Congratulations! You guessed it right!");
          this.guessedRight = true;
          localStorage.setItem('guessedRight', this.guessedRight);
        } else {
          console.log("Sorry, wrong guess. Try again!");
        }
        this.storeGuesses();
      }
      this.guess = "";
      if (this.numGuess == 10) {
        this.ranOutGuess=true;
        localStorage.setItem('ranOutGuess', this.ranOutGuess);
        return null;
      }
    }
  },
  async mounted() {
    await this.clearLocalStorageAtMidnight();
    await this.fetchTodayArtist();
    await this.getLocalStorage();
    this.ready = true;
    this.updateVolume();
    this.updateTime();
  }
  
};
</script>
