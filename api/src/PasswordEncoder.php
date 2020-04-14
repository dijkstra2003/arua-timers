<?php

namespace App;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

class PasswordEncoder extends MessageDigestPasswordEncoder {
    
    /**
     * Overrides the password encoder from symonfy to match the MC-EPD encoding.
     */
    public function encodePassword($raw, $salt)
    {
//        var_dump("#########################################################");
//        print("#############################################################");
        if ($this->isPasswordTooLong($raw)) {
            throw new BadCredentialsException('Invalid password.');
        }
//        die("salt: " . $salt. " - raw: " . $raw . "- hashed: " . md5(md5($raw) . $salt));
        return md5(md5($raw) . $salt);
    }
}