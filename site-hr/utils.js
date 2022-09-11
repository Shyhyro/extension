const horse = { color_info: null }


function initializeHorseProfile(doc = undefined) {
    const d = doc ?? document
    const collected = {
        name: d.title.replace(/ - Horse Reality$/, ''),
        tagline: null,
        sex: d.querySelector('img.icon16').alt,
        adult_layer_keys: [],
        foal_layer_keys: [],
        looking_at: null,
        looking_at_foal: false,
    }

    if (d.querySelector('.horse_left strong')) {
        collected.tagline = d.querySelector('.horse_left strong').innerText.trim()
    }

    let i = 0
    const pairs = d.querySelector('.infotext').children
    for (const label of [...pairs].filter((child => child.classList.contains('left')))) {
        nextIndex = i + 1
        const labelText = label.innerText.toLowerCase().replace(/ /g, '_')
        if (pairs[nextIndex] && labelText != 'lifenumber') {
            collected[labelText] = pairs[nextIndex].innerText
        } else if (labelText === 'lifenumber') {
            collected.lifenumber = Number(pairs[nextIndex].innerText.replace('#', ''))
        }
        i += 2
    }

    if (d.querySelector('#hid')) {
        collected.lifenumber = Number(d.querySelector('#hid').value)
    }

    const containers = d.querySelectorAll('.horse_photo')
    for (const container of containers) {
        for (const img of container.children) {
            const match = img.src.match(layerRegex)
            if (!match) continue

            const keyified = (
                img.src
                .replace('https://www.horsereality.com/upload/', '')
                .replace('.png', '')
            )
            if (img.className.indexOf('foal') != -1) {
                collected.foal_layer_keys.push(keyified)
            } else {
                collected.adult_layer_keys.push(keyified)
            }
        }
    }

    if (d.querySelector('.looking_at')) {
        const lookingAtTarget = d.querySelector('.looking_at').innerText.replace('You\'re currently looking at the ', '').trim()
        if (['dam', 'foal'].indexOf(lookingAtTarget) != -1) {
            collected.looking_at = lookingAtTarget
        }
        if (lookingAtTarget === 'foal') {
            collected.looking_at_foal = true
        }
    }

    if (doc) return collected
    else Object.assign(horse, collected)
}


const hrAjaxEndpoints = {
    // Horse profiles
    get_horse_info: 'get_horseinfo',  // Basic + pedigree, genetics, ...  (takes `id`)
    get_horse_info_basic: 'get_horseinfo_basic',  // Only layers, name, & sex  (takes `horse`)
    get_horse_info_foal_pasture: 'get_horseinfo_foal_pasture',
    get_horse_genetics: 'get_horsegenetics',
    update_horse_tab: 'update_horsetab',  // takes `hid` and `newtab`
    // Horse management
    discipline_horse: 'action_discipline',
    care_horse: 'action_caretaking',
    care_all_horses: 'action_caretaking_all',
    train_horse: 'action_trainhorse',
    update_horse_age: 'update_horseage',
    update_horse_info: 'update_horseinfo',
    update_horse_level: 'update_horselevel',
    update_horse_tack: 'update_horsetack',
    add_horse_to_market: 'action_horsetomarket',
    add_stable_block: 'add_stableblock',
    update_stable_block: 'update_stableblock',
    delete_stable_block: 'delete_stableblock',
    update_horse_block: 'update_horseblock',
    delete_block: 'deleteblock',
    retire_horse: 'retire_horse',
    buy_foundation_horse: 'buy_foundationhorse',
    check_lab_price: 'check_labprice',  // Gene test  (takes `hid` among others)
    update_stud_service: 'update_studservice',
    // Breeding
    breed_horses: 'action_breedhorses',
    inseminate_mare: 'action_inseminatemare',
    geld_stallion: 'action_geldstallion',
    // Forums
    forum_no_support: 'forum_nosupport',
    forum_support: 'forum_support',
    // Companies
    create_company: 'action_createcompany',
    withdraw_company: 'action_companywithdrawal',
    deposit_company: 'action_companydeposit',
    internal_task_company: 'action_companyinternaltask',
    buy_company_item: 'buy_citem',
    // Trading & money
    withdraw: 'action_withdraw',
    deposit: 'action_deposit',
    accept_offer: 'action_acceptoffer',
    cancel_trade: 'action_canceltrade',
    auto_buy_horse_market: 'buy_horsemarketauto',
    // Competitions
    organize_competition: 'organize_competition',
    enter_competition: 'action_competitionenter',
    // Feral horses
    catch_feral_horse: 'action_feralcatch',
    search_feral_horse: 'action_feralsearch',
    get_feral_horse_sex: 'get_feralimg',  // Returns the sex-icon of the horse  (takes `hid`)
    // Users
    delete_message: 'message_delete',
    get_usernames: 'getusernames',
    search_users: 'search_users',
    update_user_tab: 'update_usertab',
    // Meta (site)
    topic_dropdown: 'topicdropdown',
    // Misc.
    apply_course: 'action_applycourse',
    use_item: 'action_useitem',
    buy_item: 'buy_item',
    sell_items: 'sell_items',
    move_item: 'action_moveitem',
    discard_item: 'action_discarditem',
    organize_inspection: 'organize_inspection',
    enter_inspection: 'action_inspectionenter',
    tasks: 'action_tasks',
    all_tasks: 'action_tasks_all',
    jobs: 'action_jobs',
    update_w_tickets: 'update_wtickets',
    update_course_progress: 'update_courseprogress',
    // Account
    // confirm_delete_account: 'delete_account_step2',
}


const hrFormEndpoints = {
    // delete_account: 'user/delete',
    login: 'login',
    logout: 'logout',
    rollover: 'daily-rollover'
}


function constructEndpointUrl(endpoint) {
    const path = hrAjaxEndpoints[endpoint] ? `ajax/${hrAjaxEndpoints[endpoint]}.php` : hrFormEndpoints[endpoint]
    return `${document.location.origin}/${path}`
}


const noteStrings = {
    duplicate_color_found: 'This color shares images with other base colors. Test your horse to see if it is black (E_ aa), bay (E_ A_), or red-based (ee __).',
    white_layer_unmatched: 'This horse has white layers, but we do not recognize them. Check to see if this color info is correct.',
    shared_genotype: 'This color shares images with another genotype. If this is your horse, test it to see which genes it does or does not carry.',
}
