<?php

namespace Laravel\Jetstream {
    /**
     * @method static bool enabled(string $feature)
     * @method static bool hasTeamFeatures()
     * @method static bool termsAndPrivacyPolicy()
     * @method static bool api()
     * @method static bool teams()
     * @method static bool accountDeletion()
     */
    class Features {}
}

namespace Laravel\Fortify {
    /**
     * @method static bool enabled(string $feature)
     * @method static bool registration()
     * @method static bool resetPasswords()
     * @method static bool emailVerification()
     * @method static bool updateProfileInformation()
     * @method static bool updatePasswords()
     * @method static bool twoFactorAuthentication()
     */
    class Features {}
}
