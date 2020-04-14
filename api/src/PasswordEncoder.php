<?php

namespace App;

use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class PasswordEncoder extends MessageDigestPasswordEncoder {
    
    /**
     * Overrides the password encoder from symonfy to match the MC-EPD encoding.
     */
    public function encodePassword($raw, $salt)
    {
        if ($this->isPasswordTooLong($raw)) {
            throw new BadCredentialsException('Invalid password.');
        }

        return md5(md5($raw) . $salt);
    }
}