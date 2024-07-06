let travel;

const timeZoneMap = {
    'Australia': 'Australia/Sydney',
    'Japan': 'Asia/Tokyo',
    'Brazil': 'America/Sao_Paulo',
    'Cambodia': 'Asia/Phnom_Penh',
    'India': 'Asia/Kolkata',
    'French Polynesia': 'Pacific/Tahiti'
};

fetch('travel_recommendation.json')
    .then(res => res.json())
    .then(data => {
        travel = data;
        console.log(travel);
    })
    .catch((e) => console.log(`JSON Error : ${e}`));

const fetchTime = async (timeZone) => {
    const response = await fetch(`https://worldtimeapi.org/api/timezone/${timeZone}`);
    if (!response.ok) {
        throw new Error('Failed to fetch time');
    }
    const data = await response.json();
    return data.utc_datetime; 
}

const search_btn = document.getElementById('search-btn');

const results = document.getElementById('results');
const search_input = document.getElementById('search-bar');



const search_func = () => {
    let match =false;
    const keyword = search_input.value.toLowerCase();
    results.innerHTML = '';

    if (keyword.includes('beach')) {
        travel.beaches.forEach(beach => {
            createCard(results, beach.name, beach.imageUrl, beach.description);
            match = true;
        });
    } else if (keyword.includes('temple')) {
        travel.temples.forEach(temple => {
            createCard(results, temple.name, temple.imageUrl, temple.description);
            match = true;
        });
    } else if (keyword.includes('country')) {
        travel.countries.forEach(country => {
            createCard(results, country.name, country.imageUrl, `Search ${country.name} specifically for better results`);
            match = true;
        });
    } else {
        travel.countries.forEach(country => {
            if (keyword.includes(country.name.toLowerCase())) {
                country.cities.forEach(city => {
                    createCard(results, city.name, city.imageUrl, city.description, timeZoneMap[country.name]);
                    match = true;
                });
            }
            
        });
    }
   
     if(!match)  {
        createCard(results, "No Match" ,'background.jpg',"We do not have relevant data");
     }
   
}

const createCard = async (container, name, imageUrl, description, timeZone) => {
    const card = document.createElement('div');
    card.className = 'card';

    let currentTime = 'Loading time...';
    if (timeZone) {
        try {
            const utcTime = await fetchTime(timeZone);
            const date = new Date(utcTime);
            currentTime = new Intl.DateTimeFormat('en-US', {
                timeZone,
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).format(date);
            console.log(currentTime);
        } catch (error) {
            console.error(error);
            currentTime = 'Unable to fetch time';
        }
    }

    card.innerHTML = `
        <img src="${imageUrl}" alt="${name}">
        <div class="card-content">
            <h3>${name}</h3>
            <p>${description}</p>
            ${timeZone ? `<br/><br/><code>Current time: ${currentTime}</code>` : ''}
        </div>
    `;
    container.appendChild(card);
}

search_btn.addEventListener('click', () => {
    search_func();
});

const removeSearch = () => {
    search_input.value = "";
    results.innerHTML = '';
}

const resetBtn = document.getElementById('reset-search');

resetBtn.addEventListener('click',()=>{
    removeSearch()
});